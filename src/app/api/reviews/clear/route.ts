import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.reviews_KV_REST_API_URL || '',
  token: process.env.reviews_KV_REST_API_TOKEN || ''
})

const CACHE_KEY = 'google_reviews_cache'

export async function POST () {
  try {
    // Clear the cache
    await redis.del(CACHE_KEY)

    return NextResponse.json({
      status: 'success',
      message: 'Cache cleared successfully'
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
