"use client"

import { useEffect, useState, useCallback } from "react"
import { fetchGoogleReviews } from "@/services/googlePlaces"
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

export default function Reviews() {
  const [data, setData] = useState<ReviewsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReviews() {
      try {
        const result = await fetchGoogleReviews()
        setData(result)
        setError(null)
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
    // Create a longer sequence of reviews for smoother infinite scroll
    const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews]
    const columns = []
    const itemsPerColumn = Math.ceil(duplicatedReviews.length / 3)

    for (let i = 0; i < 3; i++) {
      // Offset each column's starting point for visual variety
      const startIndex = i * Math.floor(reviews.length / 3)
      const columnReviews = [
        ...duplicatedReviews.slice(startIndex),
        ...duplicatedReviews.slice(0, startIndex)
      ]
      columns.push(columnReviews.slice(0, itemsPerColumn))
    }

    return columns
  }, [])

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
                    className={`h-6 w-6 ${
                      i < Math.round(data.rating)
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
      <div className="relative overflow-hidden h-[500px]">
        {/* Gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background-light dark:from-background-darker to-transparent z-20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background-light dark:from-background-darker to-transparent z-20" />

        {/* Reviews grid */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 max-w-7xl mx-auto">
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="space-y-4 animate-scroll"
                style={{
                  animation: `scroll${columnIndex % 2 === 0 ? 'Down' : 'Up'} ${30 + columnIndex * 5}s linear infinite`,
                  animationDelay: `${columnIndex * -4}s`
                }}
              >
                {column.map((review, index) => (
                  <div
                    key={`${review.time}-${index}`}
                    className="review-card rounded-xl border border-neutral-200/10 dark:border-[rgb(254,249,225)]/10 bg-white/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-5 transition-colors duration-300 hover:bg-white/[0.04] dark:hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0">
                        {review.profile_photo_url ? (
                          <img
                            src={review.profile_photo_url}
                            alt={`${review.author_name}'s profile`}
                            className="h-10 w-10 rounded-full ring-2 ring-[rgb(254,249,225)]/10"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[rgb(254,249,225)]/5 text-[rgb(254,249,225)] ring-2 ring-[rgb(254,249,225)]/10 flex items-center justify-center text-sm font-medium">
                            {review.author_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-[rgb(254,249,225)]">
                          {review.author_name}
                        </h3>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-[rgb(254,249,225)]'
                                    : 'text-[rgb(254,249,225)]/20'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-[rgb(254,249,225)]/60">
                            {review.relative_time_description}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[rgb(254,249,225)]/80 line-clamp-3">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}