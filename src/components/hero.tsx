import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background-light dark:bg-background-dark min-h-[85vh] sm:min-h-[90vh] flex items-center py-16 sm:py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="text-left space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-brand dark:text-text-inverse leading-tight">
                Don&apos;t panic, 
                <span className="block mt-2 sm:mt-4 text-text-dark dark:text-accent">we can fast fix your mobile phone and tablet repairs.</span>
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Link
                  href="tel:0410422772"
                  className="rounded-full bg-brand px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 text-base sm:text-lg md:text-xl font-medium text-background-light hover:bg-brand-light transition-colors dark:bg-accent dark:hover:bg-accent-light text-center"
                >
                  <span className="hidden sm:inline">Call Us: 0410 422 772</span>
                  <span className="sm:hidden">Call: 0410 422 772</span>
                </Link>
                <Link
                  href="#pricing"
                  className="rounded-full border-2 sm:border-3 border-brand bg-transparent px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 text-base sm:text-lg md:text-xl font-medium text-brand hover:bg-brand hover:text-background-light transition-colors dark:border-accent dark:text-accent dark:hover:bg-accent dark:hover:text-background-dark text-center"
                >
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="text-left space-y-4 sm:space-y-6 mt-8 lg:mt-0">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-brand dark:text-text-inverse/90 leading-relaxed">
                SJD Tech is a skilled team specialising in mobile phone and tablet repairs. We pride ourselves on using high-quality components and offering services at the most competitive prices.
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-brand dark:text-text-inverse/90 leading-relaxed">
                Our repairs are fast, reliable, and affordable, with screen repairs often completed in just 30 minutes. We service a wide range of phones and tablets, including iPhone, Samsung, iPad, OPPO, and Google devices.
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-brand dark:text-text-inverse/90 leading-relaxed">
                Additionally, we offer a variety of accessories such as protective cases, screen protectors, chargers, cables, car accessories, batteries, and earphones. Visit us at our location in Ocean Grove, Geelong, for all your mobile repair needs.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute left-0 right-0 top-0 h-96 bg-gradient-to-b from-background-DEFAULT to-transparent dark:from-background-darker" />
        <div className="absolute -left-40 top-40 h-[600px] w-[600px] rounded-full bg-background-DEFAULT opacity-50 blur-3xl dark:bg-accent dark:opacity-10" />
        <div className="absolute -right-40 top-40 h-[600px] w-[600px] rounded-full bg-background-DEFAULT opacity-50 blur-3xl dark:bg-accent dark:opacity-10" />
      </div>
    </section>
  )
}