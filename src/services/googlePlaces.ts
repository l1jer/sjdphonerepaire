interface PlaceDetails {
  reviews: Array<{
    author_name: string
    profile_photo_url: string
    rating: number
    relative_time_description: string
    text: string
    time: number
  }>
  rating: number
  user_ratings_total: number
  error?: string
}

export async function fetchGoogleReviews(): Promise<PlaceDetails> {
  try {
    const response = await fetch('/api/reviews')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    // Check if the response contains an error
    if (data.error) {
      throw new Error(data.error)
    }

    // Validate the response format
    if (!Array.isArray(data.reviews) || typeof data.rating !== 'number' || typeof data.user_ratings_total !== 'number') {
      console.error('Invalid API response:', data)
      throw new Error('Invalid API response format')
    }

    return {
      reviews: data.reviews,
      rating: data.rating,
      user_ratings_total: data.user_ratings_total
    }
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    throw error
  }
}