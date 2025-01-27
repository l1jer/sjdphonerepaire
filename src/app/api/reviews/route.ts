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

// Initialize Redis client
const redis = new Redis({
  url: process.env.reviews_KV_REST_API_URL || '',
  token: process.env.reviews_KV_REST_API_TOKEN || ''
})

// Test Redis connection
redis
  .ping()
  .then(() => {
    console.log('Redis connection successful!')
  })
  .catch(error => {
    console.error('Redis connection failed:', error)
  })

// Use GOOGLE_PLACES_API_KEY instead of NEXT_PUBLIC_ version for server-side
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const PLACE_ID = 'ChIJncP4AAw51GoRHBRenZ9MLxg'
const CACHE_KEY = 'google_reviews_cache'
const CACHE_DURATION = 24 * 60 * 60 // 24 hours in seconds
const HISTORICAL_CACHE_KEY = 'google_reviews_historical'

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
  return allReviews.sort((a, b) => b.time - a.time)
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
    console.log('Checking Redis cache...')
    const cachedData = await redis.get(CACHE_KEY)
    if (cachedData) {
      console.log('Cache hit! Serving from Redis cache')
      return NextResponse.json(cachedData)
    }
    console.log('Cache miss! Fetching from Google API...')

    // 获取所有评论
    const allReviews = await getAllReviews(PLACE_ID, GOOGLE_PLACES_API_KEY)

    // 获取基本信息
    const basicInfoUrl = new URL(
      'https://maps.googleapis.com/maps/api/place/details/json'
    )
    basicInfoUrl.searchParams.append('place_id', PLACE_ID)
    basicInfoUrl.searchParams.append('key', GOOGLE_PLACES_API_KEY)
    basicInfoUrl.searchParams.append('fields', 'rating,user_ratings_total')

    const basicInfoResponse = await fetch(basicInfoUrl.toString())
    const basicInfoData: PlaceDetailsResponse = await basicInfoResponse.json()

    const responseData: ResponseData = {
      reviews: allReviews,
      rating: basicInfoData.result.rating || 0,
      user_ratings_total: basicInfoData.result.user_ratings_total || 0,
      cache_timestamp: new Date().toISOString(),
      reviews_count: allReviews.length
    }

    // Store in Redis cache with expiration
    await redis.set(CACHE_KEY, responseData, {
      ex: CACHE_DURATION
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
