import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.reviews_KV_REST_API_URL || '',
  token: process.env.reviews_KV_REST_API_TOKEN || ''
})

const CACHE_KEY = 'google_reviews_cache'

export async function GET (request: Request) {
  try {
    // Check if force refresh is requested
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'

    if (forceRefresh) {
      // Clear the cache
      await redis.del(CACHE_KEY)
      return NextResponse.json({
        status: 'success',
        message: 'Cache cleared, please fetch reviews again'
      })
    }

    // Test Redis connection
    await redis.ping()

    // Get cache data
    const cachedData = await redis.get(CACHE_KEY)

    return NextResponse.json({
      status: 'success',
      cache_exists: !!cachedData,
      cache_info: {
        exists: !!cachedData,
        reviews_count: cachedData ? cachedData.reviews.length : 0,
        total_ratings: cachedData ? cachedData.user_ratings_total : 0,
        average_rating: cachedData ? cachedData.rating : 0,
        cached_at: cachedData ? cachedData.cache_timestamp : null,
        cache_age: cachedData?.cache_timestamp
          ? `${Math.round(
              (Date.now() - new Date(cachedData.cache_timestamp).getTime()) /
                1000 /
                60
            )} minutes`
          : null
      },
      cached_data: cachedData,
      current_time: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
