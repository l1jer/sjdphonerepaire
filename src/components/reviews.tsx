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
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds (extended since we sync weekly)

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

        // If cache is expired or doesn't exist, fetch from API (which now serves from Redis)
        console.log('Fetching fresh reviews from API (Redis-backed)...')
        const result = await fetchGoogleReviews()
        setData(result)
        setError(null)
        // Log fetched reviews
        console.log('Fetched reviews from Redis-backed API:', JSON.stringify(result.reviews, null, 2))

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

  // Function to create review columns for infinite scrolling
  const createColumns = useCallback((reviews: Review[]) => {
    // Redis cache now maintains exactly 15 reviews with rolling replacement
    // No need for client-side duplication logic
    const exactReviews = reviews.slice(0, 15)
    
    // For desktop: 3 columns with 5 reviews each
    const columnCount = 3
    const reviewsPerColumn = 5

    const columns = Array(columnCount).fill(null).map((_, columnIndex) => {
      const startIndex = columnIndex * reviewsPerColumn
      const columnReviews = exactReviews.slice(startIndex, startIndex + reviewsPerColumn)

      // Create seamless infinite scroll by duplicating the column content
      return [...columnReviews, ...columnReviews] // Double for seamless loop
    })

    return columns
  }, [])

  // Function to create mobile single column layout
  const createMobileColumn = useCallback((reviews: Review[]) => {
    // Redis cache maintains exactly 15 reviews, use them all for mobile
    const exactReviews = reviews.slice(0, 15)
    // Double the content for seamless infinite scroll
    return [...exactReviews, ...exactReviews]
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
      <div className="flex flex-col gap-3 sm:gap-4 rounded-lg border-dashed border-2 p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary text-xs sm:text-sm font-medium text-primary-foreground">
            {getInitials(review.author_name)}
          </div>
          <div className="ml-2 sm:ml-3 flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-medium text-brand dark:text-[rgb(254,249,225)] truncate">
              {review.author_name}
            </h3>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${i < review.rating
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
              <span className="ml-1 sm:ml-2 text-xs text-brand/60 dark:text-[rgb(254,249,225)]/60 truncate">
                {review.relative_time_description}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-brand/80 dark:text-[rgb(254,249,225)]/80 leading-relaxed">
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
  const mobileColumn = createMobileColumn(data.reviews)

  return (
    <section id="reviews" className="relative bg-background-light dark:bg-background-darker py-16 sm:py-20">
      {/* Title Section with higher z-index */}
      <div className="relative z-30 container mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand dark:text-[rgb(254,249,225)] mb-4 sm:mb-6">
            What Our Customers Say
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2 text-base sm:text-lg md:text-xl text-brand-dark dark:text-[rgb(254,249,225)]">
            <div className="flex items-center">
              <span className="font-medium">{data.rating.toFixed(1)}</span>
              <div className="flex ml-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${i < Math.round(data.rating)
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
            <span className="mx-2 dark:text-[rgb(254,249,225)]/60 hidden sm:inline">•</span>
            <span className="text-sm sm:text-base md:text-lg">{data.user_ratings_total} reviews</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="relative overflow-hidden h-[400px] sm:h-[500px] md:h-[600px] reviews-container">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute inset-x-0 top-0 h-16 sm:h-24 md:h-32 bg-gradient-to-b from-background-light dark:from-background-darker to-transparent z-20" />
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 md:h-32 bg-gradient-to-t from-background-light dark:from-background-darker to-transparent z-20" />

        {/* Mobile: Single column with all 15 reviews */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:hidden">
          <div className="flex justify-center max-w-md mx-auto">
            <div
              className="animate-scroll w-full"
              style={{
                animation: `scrollDown 90s linear infinite`,
                animationDelay: `-30s`
              }}
            >
              {mobileColumn.map((review, reviewIndex) => (
                <ReviewCard 
                  key={`mobile_${review.time}_${reviewIndex}`} 
                  review={review} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: 3 columns with 5 reviews each */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 hidden lg:block">
          <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto">
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="animate-scroll"
                style={{
                  animation: `scroll${columnIndex % 2 === 0 ? 'Down' : 'Up'} ${60 + columnIndex * 10}s linear infinite`,
                  animationDelay: `${columnIndex * -20}s`
                }}
              >
                {column.map((review, reviewIndex) => (
                  <ReviewCard 
                    key={`desktop_${columnIndex}_${review.time}_${reviewIndex}`} 
                    review={review} 
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}