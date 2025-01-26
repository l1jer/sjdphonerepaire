import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.reviews_KV_REST_API_URL || '',
  token: process.env.reviews_KV_REST_API_TOKEN || ''
})

const CACHE_KEY = 'google_reviews_cache'

export async function GET () {
  try {
    // Get cache data
    const cachedData = await redis.get(CACHE_KEY)

    // Get Redis TTL
    const ttl = await redis.ttl(CACHE_KEY)

    return NextResponse.json({
      status: 'success',
      debug_info: {
        cache_exists: !!cachedData,
        cache_ttl_seconds: ttl,
        cache_ttl_human: `${Math.round(ttl / 60 / 60)} hours`,
        reviews_count: cachedData ? cachedData.reviews.length : 0,
        total_ratings: cachedData ? cachedData.user_ratings_total : 0,
        expected_reviews: cachedData
          ? `${cachedData.reviews.length} out of ${cachedData.user_ratings_total}`
          : 'No data',
        cache_timestamp: cachedData?.cache_timestamp,
        cache_age: cachedData?.cache_timestamp
          ? `${Math.round(
              (Date.now() - new Date(cachedData.cache_timestamp).getTime()) /
                1000 /
                60
            )} minutes`
          : null
      },
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
