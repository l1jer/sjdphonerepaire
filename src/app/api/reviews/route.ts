import { NextResponse } from 'next/server'

interface Review {
  authorAttribution: {
    displayName: string
    photoUri?: string
  }
  text: {
    text: string
  }
  rating: number
  publishTime: string
  relativePublishTimeDescription: string
}

interface PlaceResponse {
  reviews?: Review[]
  rating?: number
  userRatingCount?: number
}

// Use GOOGLE_PLACES_API_KEY instead of NEXT_PUBLIC_ version for server-side
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const PLACE_ID = 'ChIJncP4AAw51GoRHBRenZ9MLxg'

export async function GET() {
  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      { error: 'Google Places API key not configured' },
      { status: 500 }
    )
  }

  const url = new URL(`https://places.googleapis.com/v1/places/${PLACE_ID}`)

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount'
      }
    })

    if (!response.ok) {
      console.error('Places API error:', await response.text())
      return NextResponse.json(
        { error: `Places API error: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }

    const data: PlaceResponse = await response.json()
    console.log('Places API response:', data)

    // Transform the reviews to match the expected format
    const transformedReviews = data.reviews?.map(review => ({
      author_name: review.authorAttribution.displayName,
      profile_photo_url: review.authorAttribution.photoUri || '',
      rating: review.rating,
      relative_time_description: review.relativePublishTimeDescription,
      text: review.text.text,
      time: new Date(review.publishTime).getTime()
    })) || []

    return NextResponse.json({
      reviews: transformedReviews,
      rating: data.rating || 0,
      user_ratings_total: data.userRatingCount || 0
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}