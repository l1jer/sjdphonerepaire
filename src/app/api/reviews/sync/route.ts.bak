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

async function getAllReviews(placeId: string, apiKey: string): Promise<Review[]> {
  let allReviews: Review[] = []
  // Expanded sort types to get more reviews
  const sortTypes = ['most_relevant', 'newest', 'highest_rating', 'lowest_rating']

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

  // Sort by time, newest first, and return exactly 15 reviews
  return allReviews.sort((a, b) => b.time - a.time).slice(0, 15)
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
    // Fetch all reviews from Google Places API
    const allReviews = await getAllReviews(PLACE_ID, GOOGLE_PLACES_API_KEY)

    // Get basic place information
    const basicInfoUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    basicInfoUrl.searchParams.append('place_id', PLACE_ID)
    basicInfoUrl.searchParams.append('key', GOOGLE_PLACES_API_KEY)
    basicInfoUrl.searchParams.append('fields', 'rating,user_ratings_total')

    const basicInfoResponse = await fetch(basicInfoUrl.toString())
    const basicInfoData: PlaceDetailsResponse = await basicInfoResponse.json()

    // Implement rolling cache logic to maintain exactly 15 reviews
    let finalReviews = allReviews

    // Check if we have existing reviews in cache
    const existingCache = await redis.get<ResponseData>(REVIEWS_CACHE_KEY)
    
    if (existingCache && existingCache.reviews) {
      console.log(`[Weekly Sync] Found ${existingCache.reviews.length} existing reviews in cache`)
      
      // Merge existing and new reviews, removing duplicates
      const existingReviews = existingCache.reviews
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
      
      // If we have fewer than 15 unique reviews, duplicate to reach 15
      if (sortedReviews.length < 15) {
        finalReviews = [...sortedReviews]
        while (finalReviews.length < 15) {
          const remainingSlots = 15 - finalReviews.length
          const reviewsToAdd = sortedReviews.slice(0, Math.min(remainingSlots, sortedReviews.length))
          finalReviews = [...finalReviews, ...reviewsToAdd]
        }
        console.log(`[Weekly Sync] Padded ${sortedReviews.length} unique reviews to ${finalReviews.length} total`)
      } else {
        // Take exactly 15 if we have more than 15
        finalReviews = sortedReviews.slice(0, 15)
        console.log(`[Weekly Sync] Rolling cache: ${mergedReviews.length} total → ${finalReviews.length} kept (15 limit)`)
      }
    } else {
      // No existing cache, pad with duplicates if needed to reach exactly 15
      if (allReviews.length > 0) {
        finalReviews = [...allReviews]
        
        // Duplicate reviews to reach exactly 15
        while (finalReviews.length < 15) {
          const remainingSlots = 15 - finalReviews.length
          const reviewsToAdd = allReviews.slice(0, Math.min(remainingSlots, allReviews.length))
          finalReviews = [...finalReviews, ...reviewsToAdd]
        }
        
        // Ensure exactly 15 reviews
        finalReviews = finalReviews.slice(0, 15)
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
  // Create a Set of existing review IDs (using time + author as unique identifier)
  const existingReviews = new Set(
    historical.map(review => `${review.time}_${review.author_name}`)
  )

  // Add new unique reviews
  const newReviews = current.filter(
    review => !existingReviews.has(`${review.time}_${review.author_name}`)
  )

  // Merge and sort by time
  return [...historical, ...newReviews].sort((a, b) => b.time - a.time)
}
