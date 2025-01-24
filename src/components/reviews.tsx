import Image from "next/image"

const reviews = [
  {
    name: "Sarah Johnson",
    role: "iPhone User",
    image: "/review1.jpg",
    content:
      "Fantastic service! They fixed my iPhone screen in under an hour. The quality of work is excellent, and the price was very reasonable.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Samsung User",
    image: "/review2.jpg",
    content:
      "Professional and knowledgeable staff. They replaced my Samsung's battery, and it's working like new. Highly recommended!",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    role: "Google Pixel User",
    image: "/review3.jpg",
    content:
      "Great experience from start to finish. They were honest about the repair needs and completed the work quickly. Will definitely return!",
    rating: 5,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  return (
    <section id="reviews" className="bg-white py-24 dark:bg-dark/50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-dark dark:text-white">
            Customer Reviews
          </h2>
          <p className="mx-auto max-w-2xl text-body dark:text-body">
            Don&apos;t just take our word for it. Here&apos;s what our customers have to say about our repair service.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-2xl border border-body/10 bg-body-background p-8 dark:border-dark/10 dark:bg-dark"
            >
              <div className="mb-6 flex items-center space-x-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={review.image}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-dark dark:text-white">
                    {review.name}
                  </h3>
                  <p className="text-sm text-body">{review.role}</p>
                </div>
              </div>
              <StarRating rating={review.rating} />
              <p className="mt-4 text-dark dark:text-body">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}