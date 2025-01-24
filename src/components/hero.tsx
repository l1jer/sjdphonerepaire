import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-body-background pt-16 dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-dark dark:text-white md:text-6xl lg:text-7xl">
            Expert Phone Repair
            <br />
            <span className="text-primary">When You Need It</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-body dark:text-body md:text-xl">
            Professional repair service for all major phone brands. Fast, reliable, and backed by our satisfaction guarantee.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="#pricing"
              className="rounded-full bg-primary px-8 py-3 text-lg font-medium text-white hover:bg-primary-hover"
            >
              View Pricing
            </Link>
            <Link
              href="#contact"
              className="rounded-full border border-body/20 bg-transparent px-8 py-3 text-lg font-medium text-dark hover:bg-body/10 dark:text-white dark:hover:bg-dark-text/10"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="relative mt-16 flex justify-center">
          <div className="relative aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image
              src="/hero-image.jpg"
              alt="Phone repair service"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-body-background dark:from-dark to-transparent" />
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            { number: "10+", label: "Years Experience" },
            { number: "50k+", label: "Repairs Completed" },
            { number: "4.9", label: "Average Rating" },
            { number: "90min", label: "Average Repair Time" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-primary">{stat.number}</div>
              <div className="mt-1 text-sm text-body dark:text-body">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}