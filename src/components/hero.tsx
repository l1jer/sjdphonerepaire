import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background-light dark:bg-background-dark pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-brand dark:text-text-inverse md:text-6xl lg:text-7xl">
            Expert Phone Repair
            <br />
            <span className="text-text-dark dark:text-accent">When You Need It</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-brand dark:text-text-inverse/90 md:text-xl">
            Professional repair service for all major phone brands. Fast, reliable,
            and backed by our satisfaction guarantee.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="#contact"
              className="rounded-full bg-brand px-8 py-3 text-lg font-medium text-background-light hover:bg-brand-light transition-colors dark:bg-accent dark:hover:bg-accent-light"
            >
              Contact Us
            </Link>
            <Link
              href="#pricing"
              className="rounded-full border-2 border-brand bg-transparent px-8 py-3 text-lg font-medium text-brand hover:bg-brand hover:text-background-light transition-colors dark:border-accent dark:text-accent dark:hover:bg-accent dark:hover:text-background-dark"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* <div className="mt-16 grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            { number: "10+", label: "Years Experience" },
            { number: "50k+", label: "Repairs Completed" },
            { number: "4.9", label: "Average Rating" },
            { number: "90min", label: "Average Repair Time" },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-3xl font-bold text-brand group-hover:text-brand-light transition-colors dark:text-accent dark:group-hover:text-accent-light">
                {stat.number}
              </div>
              <div className="mt-1 text-sm text-text-dark dark:text-text-inverse/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Decorative background elements */}
      <div className="absolute left-0 right-0 top-0 h-96 bg-gradient-to-b from-background-DEFAULT to-transparent dark:from-background-darker" />
      <div className="absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-background-DEFAULT opacity-50 blur-3xl dark:bg-accent dark:opacity-10" />
      <div className="absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-background-DEFAULT opacity-50 blur-3xl dark:bg-accent dark:opacity-10" />
    </section>
  )
}