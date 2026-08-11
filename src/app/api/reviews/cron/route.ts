import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

interface Review {
  time: number
  author_name: string
  rating: number
}

interface CachedData {
  reviews: Review[]
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

// Only 5-star reviews are shown publicly on the site
function filterFiveStarReviews (reviews: Review[]): Review[] {
  return reviews.filter(review => review.rating === 5)
}

export async function GET (request: Request) {
  // Verify cron secret to ensure this is a legitimate cron job
  const { searchParams } = new URL(request.url)
  const cronSecret = searchParams.get('cron_secret')

  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get current cached reviews
    const currentCache = await redis.get<CachedData>(CACHE_KEY)

    if (currentCache) {
      // Get historical reviews
      const historicalReviews = (await redis.get<HistoricalData>(
        HISTORICAL_CACHE_KEY
      )) || {
        reviews: [],
        last_updated: new Date().toISOString(),
        total_collected: 0
      }

      // Merge new reviews with historical data, keeping only 5-star reviews
      const mergedReviews = mergeReviews(
        historicalReviews.reviews,
        filterFiveStarReviews(currentCache.reviews)
      )

      // Store merged data
      await redis.set(HISTORICAL_CACHE_KEY, {
        reviews: mergedReviews,
        last_updated: new Date().toISOString(),
        total_collected: mergedReviews.length
      })

      return NextResponse.json({
        status: 'success',
        new_reviews: currentCache.reviews.length,
        total_historical: mergedReviews.length
      })
    }

    return NextResponse.json({
      status: 'no_action',
      message: 'No current cache found'
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Failed to process reviews' },
      { status: 500 }
    )
  }
}

function mergeReviews (historical: Review[], current: Review[]): Review[] {
  // Dedupe across both lists (using time + author as the unique identifier), since
  // independent sync/cron endpoints can otherwise reintroduce duplicate entries
  const merged = new Map<string, Review>()
  for (const review of [...historical, ...current]) {
    merged.set(`${review.time}_${review.author_name}`, review)
  }

  return [...merged.values()].sort((a, b) => b.time - a.time)
}
