"use client"

import { useEffect, useState, useCallback } from "react"
import { fetchGoogleReviews } from "@/services/googlePlaces"
// import Image from "next/image"
import "@/styles/reviews.css"

interface Review {
  author_name: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface ReviewsData {
  reviews: Review[]
  rating: number
  user_ratings_total: number
}

const CACHE_KEY = 'googleReviewsCache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export default function Reviews() {
  const [data, setData] = useState<ReviewsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        // Check local storage for cached data
        const cachedData = localStorage.getItem(CACHE_KEY)
        const cachedTime = localStorage.getItem(`${CACHE_KEY}_timestamp`)

        if (cachedData && cachedTime) {
          const parsedData = JSON.parse(cachedData)
          const cacheAge = Date.now() - parseInt(cachedTime)

          if (cacheAge < CACHE_DURATION) {
            setData(parsedData)
            setError(null)
            setLoading(false)
            // Log cached reviews
            console.log('Loaded reviews from cache:', JSON.stringify(parsedData.reviews, null, 2))
            return
          }
        }

        // If cache is expired or doesn't exist, fetch new data
        const result = await fetchGoogleReviews()
        setData(result)
        setError(null)
        // Log fetched reviews
        console.log('Fetched reviews from API:', JSON.stringify(result.reviews, null, 2))

        // Update cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(result))
        localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [])

  // Function to create review columns with different starting points
  const createColumns = useCallback((reviews: Review[]) => {
    // Copy reviews array to avoid modifying original data
    let allReviews = [...reviews]

    // If there aren't enough reviews, duplicate them to reach minimum length
    while (allReviews.length < 6) {
      allReviews = [...allReviews, ...reviews]
    }

    // Create columns based on screen size
    // For mobile (1 column): 3 reviews per column
    // For tablet (2 columns): 3 reviews per column
    // For desktop (3 columns): 3 reviews per column
    const columnCount = 3 // Maximum number of columns
    const reviewsPerColumn = 3

    const columns = Array(columnCount).fill(null).map((_, columnIndex) => {
      const startIndex = columnIndex * reviewsPerColumn
      const columnReviews = allReviews.slice(startIndex, startIndex + reviewsPerColumn)

      // Repeat these reviews 2 times to create scrolling effect
      return Array(2).fill(columnReviews).flat()
    })

    return columns
  }, [])

  const ReviewCard = ({ review }: { review: Review }) => {
    // Get initials from reviewer name
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    };

    return (
      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {getInitials(review.author_name)}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-brand dark:text-[rgb(254,249,225)]">
              {review.author_name}
            </h3>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < review.rating
                      ? 'text-brand dark:text-[rgb(254,249,225)]'
                      : 'text-brand/20 dark:text-[rgb(254,249,225)]/20'
                      }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-xs text-brand/60 dark:text-[rgb(254,249,225)]/60">
                {review.relative_time_description}
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-brand/80 dark:text-[rgb(254,249,225)]/80">
          {review.text}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-brand dark:text-[rgb(254,249,225)] animate-pulse">Loading reviews...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">{error}</div>
      </div>
    )
  }

  if (!data || !data.reviews.length) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-brand dark:text-[rgb(254,249,225)]">No reviews available</div>
      </div>
    )
  }

  const columns = createColumns(data.reviews)

  return (
    <section className="relative bg-background-light dark:bg-background-darker py-20">
      {/* Title Section with higher z-index */}
      <div className="relative z-30 container mx-auto px-4 mb-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-brand dark:text-[rgb(254,249,225)] mb-6">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 text-xl text-brand-dark dark:text-[rgb(254,249,225)]">
            <div className="flex items-center">
              <span className="font-medium">{data.rating.toFixed(1)}</span>
              <div className="flex ml-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-6 w-6 ${i < Math.round(data.rating)
                      ? 'text-brand dark:text-[rgb(254,249,225)]'
                      : 'text-brand/20 dark:text-[rgb(254,249,225)]/20'
                      }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <span className="mx-2 dark:text-[rgb(254,249,225)]/60">•</span>
            <span>{data.user_ratings_total} reviews</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="relative overflow-hidden h-[600px]">
        {/* Gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background-light dark:from-background-darker to-transparent z-20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background-light dark:from-background-darker to-transparent z-20" />

        {/* Reviews grid */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="space-y-6 animate-scroll"
                style={{
                  animation: `scroll${columnIndex % 2 === 0 ? 'Down' : 'Up'} ${40 + columnIndex * 5}s linear infinite`,
                  animationDelay: `${columnIndex * -8}s`
                }}
              >
                {column.map((review, reviewIndex) => (
                  <ReviewCard key={`${review.time}_${reviewIndex}`} review={review} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}