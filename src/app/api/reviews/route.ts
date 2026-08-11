import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

interface Review {
  author_name: string
  author_url: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
  time: number
  language?: string
  translated: boolean
}

interface PlaceDetailsResponse {
  result: {
    reviews: Review[]
    rating: number
    user_ratings_total: number
    next_page_token?: string
  }
  status: string
}

interface HistoricalData {
  reviews: Review[]
  last_updated: string
}

interface ResponseData {
  reviews: Review[]
  rating: number
  user_ratings_total: number
  cache_timestamp: string
  reviews_count: number
  historical_reviews?: Review[]
  total_historical_count?: number
  historical_last_updated?: string
}

// Initialize Redis client with provided credentials
const redis = new Redis({
  url: process.env.reviews_KV_REST_API_URL || '',
  token: process.env.reviews_KV_REST_API_TOKEN || ''
})

// Test Redis connection
redis
  .ping()
  .then(() => {
    // console.log('Redis connection successful!')
  })
  .catch(error => {
    console.error('Redis connection failed:', error)
  })

// Use GOOGLE_PLACES_API_KEY instead of NEXT_PUBLIC_ version for server-side
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const PLACE_ID = 'ChIJncP4AAw51GoRHBRenZ9MLxg'
const CACHE_KEY = 'google_reviews_cache'
const WEEKLY_CACHE_KEY = 'reviews_weekly_cache'
const CACHE_DURATION = 24 * 60 * 60 // 24 hours in seconds
const HISTORICAL_CACHE_KEY = 'google_reviews_historical'
// Google only returns a handful of reviews per API call, so the display cache is
// topped up from the accumulated historical pool to give more variety on the site
const TARGET_REVIEW_COUNT = 30

// Only 5-star reviews are shown publicly on the site
function filterFiveStarReviews (reviews: Review[]): Review[] {
  return reviews.filter(review => review.rating === 5)
}

function reviewKey (review: Review): string {
  return `${review.time}_${review.author_name}`
}

// Tops up a review list from the historical pool, preferring the newest unseen
// 5-star reviews, so the display cache draws on all reviews ever collected
// rather than duplicating the same small batch
async function topUpFromHistorical (existing: Review[], neededCount: number): Promise<Review[]> {
  if (neededCount <= 0) return []

  const historicalData = await redis.get<HistoricalData>(HISTORICAL_CACHE_KEY)
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

async function getAllReviews (
  placeId: string,
  apiKey: string
): Promise<Review[]> {
  let allReviews: Review[] = []
  const sortTypes = ['most_relevant', 'newest', 'highest_rating']

  for (const sortType of sortTypes) {
    // Build base URL
    const url = new URL(
      'https://maps.googleapis.com/maps/api/place/details/json'
    )
    url.searchParams.append('place_id', placeId)
    url.searchParams.append('key', apiKey)
    url.searchParams.append('language', 'en')
    url.searchParams.append('reviews_sort', sortType)
    url.searchParams.append('reviews_no_translations', 'true')

    console.log(`Fetching reviews with sort type: ${sortType}`)
    const response = await fetch(url.toString())
    const data: PlaceDetailsResponse = await response.json()

    if (data.status !== 'OK') {
      console.error(`API error for ${sortType}:`, data.status)
      continue
    }

    if (data.result.reviews) {
      // Use Set for deduplication based on timestamp and author
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
        `Fetched ${newReviews.length} unique reviews from ${sortType}. Total unique reviews: ${allReviews.length}`
      )
    }

    // Google API rate limiting, add delay
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  // Sort by time, newest first
  return allReviews.sort((a, b) => b.time - a.time).slice(0, TARGET_REVIEW_COUNT)
}

// API route for handling reviews
export async function GET () {
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('API key missing')
    return NextResponse.json(
      { error: 'Google Places API key not configured' },
      { status: 500 }
    )
  }

  try {
    // First, check weekly cache (primary source)
    console.log('Checking weekly Redis cache...')
    const weeklyCache = await redis.get<ResponseData>(WEEKLY_CACHE_KEY)
    if (weeklyCache) {
      console.log('Weekly cache hit! Serving from weekly Redis cache')
      // Purge any non-5-star reviews left over from before the rating filter was added,
      // and top up from the historical pool if the cache is short of the target count
      const cleanReviews = filterFiveStarReviews(weeklyCache.reviews)
      const supplemental = await topUpFromHistorical(cleanReviews, TARGET_REVIEW_COUNT - cleanReviews.length)
      return NextResponse.json({
        ...weeklyCache,
        reviews: [...cleanReviews, ...supplemental]
      })
    }
    
    // Fallback to daily cache
    console.log('Weekly cache miss! Checking daily Redis cache...')
    const dailyCache = await redis.get<ResponseData>(CACHE_KEY)
    if (dailyCache) {
      console.log('Daily cache hit! Serving from daily Redis cache')
      const cleanReviews = filterFiveStarReviews(dailyCache.reviews)
      const supplemental = await topUpFromHistorical(cleanReviews, TARGET_REVIEW_COUNT - cleanReviews.length)
      return NextResponse.json({
        ...dailyCache,
        reviews: [...cleanReviews, ...supplemental]
      })
    }
    
    console.log('No cache found! Fetching from Google API as fallback...')

    // Fetch fresh reviews, keeping only 5-star reviews
    const allReviews = filterFiveStarReviews(
      await getAllReviews(PLACE_ID, GOOGLE_PLACES_API_KEY)
    )

    // 获取基本信息
    const basicInfoUrl = new URL(
      'https://maps.googleapis.com/maps/api/place/details/json'
    )
    basicInfoUrl.searchParams.append('place_id', PLACE_ID)
    basicInfoUrl.searchParams.append('key', GOOGLE_PLACES_API_KEY)
    basicInfoUrl.searchParams.append('fields', 'rating,user_ratings_total')

    const basicInfoResponse = await fetch(basicInfoUrl.toString())
    const basicInfoData: PlaceDetailsResponse = await basicInfoResponse.json()

    // Implement rolling cache logic to maintain a large, varied pool of reviews
    let finalReviews = allReviews

    // Check if we have existing reviews in weekly cache first
    const existingWeeklyCache = await redis.get<ResponseData>(WEEKLY_CACHE_KEY)
    
    if (existingWeeklyCache && existingWeeklyCache.reviews) {
      console.log(`[Daily Sync] Found ${existingWeeklyCache.reviews.length} existing reviews in weekly cache`)
      
      // Purge any non-5-star reviews left over from previous syncs, then merge in new ones
      const existingReviews = filterFiveStarReviews(existingWeeklyCache.reviews)
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
        console.log(`[Daily Sync] Topped up ${sortedReviews.length} unique reviews with ${supplemental.length} from historical pool → ${finalReviews.length} total`)

        // Only duplicate as a last resort if the historical pool still isn't enough
        if (finalReviews.length < TARGET_REVIEW_COUNT && finalReviews.length > 0) {
          const pool = [...finalReviews]
          while (finalReviews.length < TARGET_REVIEW_COUNT) {
            const remainingSlots = TARGET_REVIEW_COUNT - finalReviews.length
            finalReviews = [...finalReviews, ...pool.slice(0, Math.min(remainingSlots, pool.length))]
          }
          console.log(`[Daily Sync] Historical pool exhausted, padded to ${finalReviews.length} total`)
        }
      } else {
        // Take the newest TARGET_REVIEW_COUNT if we have more than that
        finalReviews = sortedReviews.slice(0, TARGET_REVIEW_COUNT)
        console.log(`[Daily Sync] Rolling cache: ${mergedReviews.length} total → ${finalReviews.length} kept (${TARGET_REVIEW_COUNT} limit)`)
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
      console.log(`[Daily Sync] No existing cache, created initial set of ${finalReviews.length} reviews (from ${allReviews.length} originals)`)
    }

    const responseData: ResponseData = {
      reviews: finalReviews,
      rating: basicInfoData.result.rating || 0,
      user_ratings_total: basicInfoData.result.user_ratings_total || 0,
      cache_timestamp: new Date().toISOString(),
      reviews_count: finalReviews.length
    }

    // Store in Redis cache with expiration
    await redis.set(CACHE_KEY, responseData, {
      ex: CACHE_DURATION
    })

    // Also update the weekly cache with the new rolling data
    await redis.set(WEEKLY_CACHE_KEY, responseData, {
      ex: 7 * 24 * 60 * 60 // 7 days
    })

    // Get historical data if available
    const historicalData = await redis.get<HistoricalData>(HISTORICAL_CACHE_KEY)
    if (historicalData) {
      responseData.historical_reviews = historicalData.reviews
      responseData.total_historical_count = historicalData.reviews.length
      responseData.historical_last_updated = historicalData.last_updated
    }

    console.log('Total reviews collected:', allReviews.length)

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
