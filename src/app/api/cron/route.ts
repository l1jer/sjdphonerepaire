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

interface CacheData {
  reviews: Review[]
  rating: number
  user_ratings_total: number
  cache_timestamp: string
  reviews_count: number
}

interface HistoricalData {
  reviews: Review[]
  last_updated: string
  total_collected: number
}

const redis = new Redis({
  url: process.env.reviews_KV_REST_API_URL || '',
  token: process.env.reviews_KV_REST_API_TOKEN || ''
})

const CACHE_KEY = 'google_reviews_cache'
const HISTORICAL_CACHE_KEY = 'google_reviews_historical'

export async function GET (req: Request) {
  try {
    // Verify authorization header
    const authHeader = req.headers.get('Authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current cached reviews
    const currentCache = (await redis.get(CACHE_KEY)) as CacheData | null
    if (!currentCache) {
      return new NextResponse('Hello Cron!', { status: 200 })
    }

    // Get historical reviews
    const historicalData = ((await redis.get(
      HISTORICAL_CACHE_KEY
    )) as HistoricalData) || {
      reviews: [],
      last_updated: new Date().toISOString(),
      total_collected: 0
    }

    // Merge new reviews with historical data
    const mergedReviews = mergeReviews(
      historicalData.reviews,
      currentCache.reviews
    )

    // Store merged data
    await redis.set(HISTORICAL_CACHE_KEY, {
      reviews: mergedReviews,
      last_updated: new Date().toISOString(),
      total_collected: mergedReviews.length
    })

    return NextResponse.json({
      status: 'success',
      message: 'Historical reviews updated',
      new_count: currentCache.reviews.length,
      total_count: mergedReviews.length,
      last_updated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function mergeReviews (historical: Review[], current: Review[]): Review[] {
  const existingReviews = new Set(
    historical.map(review => `${review.time}_${review.author_name}`)
  )

  const newReviews = current.filter(
    review => !existingReviews.has(`${review.time}_${review.author_name}`)
  )

  return [...historical, ...newReviews].sort((a, b) => b.time - a.time)
}
