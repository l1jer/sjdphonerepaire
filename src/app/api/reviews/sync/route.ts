import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

interface Review {
  author_name: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface PlaceDetailsResponse {
  result: {
    reviews?: Review[]
    rating?: number
    user_ratings_total?: number
  }
  status: string
}

interface ResponseData {
  reviews: Review[]
  rating: number
  user_ratings_total: number
  cache_timestamp: string
  reviews_count: number
  sync_type: 'weekly' | 'manual'
}

// Initialize Redis with provided credentials
const redis = new Redis({
  url: process.env.reviews_KV_REST_API_URL || '',
  token: process.env.reviews_KV_REST_API_TOKEN || ''
})

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const PLACE_ID = 'ChIJncP4AAw51GoRHBRenZ9MLxg'
const REVIEWS_CACHE_KEY = 'reviews_weekly_cache'
const CACHE_DURATION = 7 * 24 * 60 * 60 // 7 days in seconds
const HISTORICAL_CACHE_KEY = 'google_reviews_historical'
// Google only returns a handful of reviews per API call, so the display cache is
// topped up from the accumulated historical pool to give more variety on the site
const TARGET_REVIEW_COUNT = 30

// Only 5-star reviews are shown publicly on the site
function filterFiveStarReviews(reviews: Review[]): Review[] {
  return reviews.filter(review => review.rating === 5)
}

function reviewKey(review: Review): string {
  return `${review.time}_${review.author_name}`
}

// Tops up a review list from the historical pool, preferring the newest unseen
// 5-star reviews, so the display cache draws on all reviews ever collected
// rather than duplicating the same small batch from the latest sync
async function topUpFromHistorical(existing: Review[], neededCount: number): Promise<Review[]> {
  if (neededCount <= 0) return []

  const historicalData = await redis.get<{ reviews: Review[] }>(HISTORICAL_CACHE_KEY)
  if (!historicalData?.reviews) return []

  const existingKeys = new Set(existing.map(reviewKey))
  // Historical pool can contain duplicate entries for the same review (accumulated
  // across many sync runs), so dedupe it before drawing candidates from it
  const uniqueHistorical = new Map<string, Review>()
  for (const review of filterFiveStarReviews(historicalData.reviews)) {
    const key = reviewKey(review)
    if (!existingKeys.has(key) && !uniqueHistorical.has(key)) {
      uniqueHistorical.set(key, review)
    }
  }

  return [...uniqueHistorical.values()]
    .sort((a, b) => b.time - a.time)
    .slice(0, neededCount)
}

async function getAllReviews(placeId: string, apiKey: string): Promise<Review[]> {
  let allReviews: Review[] = []
  // Only sort types that surface positive reviews; 'lowest_rating' is intentionally
  // excluded so 1-3 star reviews never enter the pool of reviews we display
  const sortTypes = ['most_relevant', 'newest', 'highest_rating']

  for (const sortType of sortTypes) {
    try {
      const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
      url.searchParams.append('place_id', placeId)
      url.searchParams.append('key', apiKey)
      url.searchParams.append('language', 'en')
      url.searchParams.append('reviews_sort', sortType)
      url.searchParams.append('reviews_no_translations', 'true')

      console.log(`[Weekly Sync] Fetching reviews with sort type: ${sortType}`)
      const response = await fetch(url.toString())
      const data: PlaceDetailsResponse = await response.json()

      if (data.status !== 'OK') {
        console.error(`[Weekly Sync] API error for ${sortType}:`, data.status)
        continue
      }

      if (data.result.reviews) {
        // Deduplicate based on timestamp and author
        const newReviews = data.result.reviews.filter(
          newReview =>
            !allReviews.some(
              existingReview =>
                existingReview.time === newReview.time &&
                existingReview.author_name === newReview.author_name
            )
        )

        allReviews = [...allReviews, ...newReviews]
        console.log(
          `[Weekly Sync] Fetched ${newReviews.length} unique reviews from ${sortType}. Total: ${allReviews.length}`
        )
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`[Weekly Sync] Error fetching ${sortType}:`, error)
    }
  }

  // Sort by time, newest first
  return allReviews.sort((a, b) => b.time - a.time).slice(0, TARGET_REVIEW_COUNT)
}

export async function GET(request: Request) {
  console.log('[Weekly Sync] Starting weekly reviews sync...')
  
  // Verify this is a legitimate cron job or manual trigger
  const { searchParams } = new URL(request.url)
  const cronSecret = searchParams.get('cron_secret')
  const manualTrigger = searchParams.get('manual') === 'true'

  if (!manualTrigger && cronSecret !== process.env.CRON_SECRET) {
    console.error('[Weekly Sync] Unauthorized access attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!GOOGLE_PLACES_API_KEY) {
    console.error('[Weekly Sync] Google Places API key not configured')
    return NextResponse.json(
      { error: 'Google Places API key not configured' },
      { status: 500 }
    )
  }

  try {
    // Fetch all reviews from Google Places API, keeping only 5-star reviews
    const allReviews = filterFiveStarReviews(
      await getAllReviews(PLACE_ID, GOOGLE_PLACES_API_KEY)
    )

    // Get basic place information
    const basicInfoUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    basicInfoUrl.searchParams.append('place_id', PLACE_ID)
    basicInfoUrl.searchParams.append('key', GOOGLE_PLACES_API_KEY)
    basicInfoUrl.searchParams.append('fields', 'rating,user_ratings_total')

    const basicInfoResponse = await fetch(basicInfoUrl.toString())
    const basicInfoData: PlaceDetailsResponse = await basicInfoResponse.json()

    // Implement rolling cache logic to maintain a large, varied pool of reviews
    let finalReviews = allReviews

    // Check if we have existing reviews in cache
    const existingCache = await redis.get<ResponseData>(REVIEWS_CACHE_KEY)
    
    if (existingCache && existingCache.reviews) {
      console.log(`[Weekly Sync] Found ${existingCache.reviews.length} existing reviews in cache`)
      
      // Purge any non-5-star reviews left over from previous syncs, then merge in new ones
      const existingReviews = filterFiveStarReviews(existingCache.reviews)
      console.log(`[Weekly Sync] ${existingCache.reviews.length - existingReviews.length} non-5-star reviews purged from cache`)
      const mergedReviews = [...existingReviews]
      
      // Add new reviews that don't already exist
      for (const newReview of allReviews) {
        const exists = existingReviews.some(existing => 
          existing.time === newReview.time && existing.author_name === newReview.author_name
        )
        if (!exists) {
          mergedReviews.push(newReview)
        }
      }
      
      // Sort by time (newest first)
      const sortedReviews = mergedReviews.sort((a, b) => b.time - a.time)
      
      if (sortedReviews.length < TARGET_REVIEW_COUNT) {
        // Top up from the historical pool of unique 5-star reviews before ever duplicating
        const supplemental = await topUpFromHistorical(sortedReviews, TARGET_REVIEW_COUNT - sortedReviews.length)
        finalReviews = [...sortedReviews, ...supplemental]
        console.log(`[Weekly Sync] Topped up ${sortedReviews.length} unique reviews with ${supplemental.length} from historical pool → ${finalReviews.length} total`)

        // Only duplicate as a last resort if the historical pool still isn't enough
        if (finalReviews.length < TARGET_REVIEW_COUNT && finalReviews.length > 0) {
          const pool = [...finalReviews]
          while (finalReviews.length < TARGET_REVIEW_COUNT) {
            const remainingSlots = TARGET_REVIEW_COUNT - finalReviews.length
            finalReviews = [...finalReviews, ...pool.slice(0, Math.min(remainingSlots, pool.length))]
          }
          console.log(`[Weekly Sync] Historical pool exhausted, padded to ${finalReviews.length} total`)
        }
      } else {
        // Take the newest TARGET_REVIEW_COUNT if we have more than that
        finalReviews = sortedReviews.slice(0, TARGET_REVIEW_COUNT)
        console.log(`[Weekly Sync] Rolling cache: ${mergedReviews.length} total → ${finalReviews.length} kept (${TARGET_REVIEW_COUNT} limit)`)
      }
    } else {
      // No existing cache, top up from the historical pool before ever duplicating
      if (allReviews.length > 0) {
        finalReviews = [...allReviews]

        const supplemental = await topUpFromHistorical(finalReviews, TARGET_REVIEW_COUNT - finalReviews.length)
        finalReviews = [...finalReviews, ...supplemental]

        if (finalReviews.length < TARGET_REVIEW_COUNT) {
          const pool = [...finalReviews]
          while (finalReviews.length < TARGET_REVIEW_COUNT) {
            const remainingSlots = TARGET_REVIEW_COUNT - finalReviews.length
            finalReviews = [...finalReviews, ...pool.slice(0, Math.min(remainingSlots, pool.length))]
          }
        }

        finalReviews = finalReviews.slice(0, TARGET_REVIEW_COUNT)
      }
      console.log(`[Weekly Sync] No existing cache, created initial set of ${finalReviews.length} reviews (from ${allReviews.length} originals)`)
    }

    // Prepare response data
    const responseData: ResponseData = {
      reviews: finalReviews,
      rating: basicInfoData.result.rating || 0,
      user_ratings_total: basicInfoData.result.user_ratings_total || 0,
      cache_timestamp: new Date().toISOString(),
      reviews_count: finalReviews.length,
      sync_type: manualTrigger ? 'manual' : 'weekly'
    }

    // Store in Redis with 7-day expiration
    await redis.set(REVIEWS_CACHE_KEY, responseData, {
      ex: CACHE_DURATION
    })

    // Update historical data
    const historicalData = await redis.get<{reviews: Review[], last_updated: string, total_collected: number}>(HISTORICAL_CACHE_KEY)
    if (historicalData) {
      const mergedReviews = mergeReviews(
        historicalData.reviews || [],
        allReviews
      )
      
      await redis.set(HISTORICAL_CACHE_KEY, {
        reviews: mergedReviews,
        last_updated: new Date().toISOString(),
        total_collected: mergedReviews.length
      })
    }

    console.log(`[Weekly Sync] Successfully synced ${allReviews.length} reviews to Redis`)

    return NextResponse.json({
      success: true,
      reviews_synced: allReviews.length,
      rating: responseData.rating,
      user_ratings_total: responseData.user_ratings_total,
      cache_timestamp: responseData.cache_timestamp,
      sync_type: responseData.sync_type,
      next_sync: manualTrigger ? 'Next weekly sync: Monday 6:00 AM' : 'Next weekly sync: Monday 6:00 AM'
    })

  } catch (error) {
    console.error('[Weekly Sync] Error during sync:', error)
    return NextResponse.json(
      { 
        error: 'Failed to sync reviews',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function mergeReviews(historical: Review[], current: Review[]): Review[] {
  // Dedupe across both lists (using time + author as the unique identifier), since
  // independent sync/cron endpoints can otherwise reintroduce duplicate entries
  const merged = new Map<string, Review>()
  for (const review of [...historical, ...current]) {
    merged.set(reviewKey(review), review)
  }

  return [...merged.values()].sort((a, b) => b.time - a.time)
}
