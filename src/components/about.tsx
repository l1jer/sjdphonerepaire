export default function About() {
  return (
    <section id="about" className="relative bg-background-light dark:bg-background-dark py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand dark:text-text-inverse mb-4 sm:mb-6">
              About SJD Tech
            </h2>
            <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl text-text-dark dark:text-text-inverse/80 leading-relaxed">
              Your trusted partner for professional phone and tablet repairs in Ocean Grove
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center md:text-left space-y-4">
              <div className="flex justify-center md:justify-start">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-brand/10 dark:bg-accent/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 sm:h-8 sm:w-8 text-brand dark:text-accent">
                    <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.453 6.714 6.714 0 0 1-.937.17v4.662c0 .326.277.585.6.543.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                    <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand dark:text-text-inverse">
                Expert Phone Repair
              </h3>
              <p className="text-base sm:text-lg text-text-dark dark:text-text-inverse/90 leading-relaxed">
                SJD Tech is a skilled specialist team in mobile phone and tablet repairs. We pride ourselves on using high-quality components and offering services at the most competitive prices.
              </p>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="flex justify-center md:justify-start">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-brand/10 dark:bg-accent/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 sm:h-8 sm:w-8 text-brand dark:text-accent">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand dark:text-text-inverse">
                Fast Mobile Repair Service
              </h3>
              <p className="text-base sm:text-lg text-text-dark dark:text-text-inverse/90 leading-relaxed">
                Our repairs are fast, reliable, and affordable, with screen repairs often completed in just 30 minutes. We service a wide range of phones and tablets, including iPhone, Samsung, iPad, OPPO, and Google devices.
              </p>
            </div>

            <div className="text-center md:text-left space-y-4 md:col-span-2 lg:col-span-1">
              <div className="flex justify-center md:justify-start">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-brand/10 dark:bg-accent/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 sm:h-8 sm:w-8 text-brand dark:text-accent">
                    <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 7.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 0 0 4.902-5.652l-1.3-1.299a1.875 1.875 0 0 0-1.325-.549H5.223Z" />
                    <path fillRule="evenodd" d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 0 0 9.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 0 0 2.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3Zm3-6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm8.25-.75a.75.75 0 0 0-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-5.25a.75.75 0 0 0-.75-.75h-3Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand dark:text-text-inverse">
              Accessories 
              </h3>
              <p className="text-base sm:text-lg text-text-dark dark:text-text-inverse/90 leading-relaxed">
                Additionally, we offer a variety of accessories such as protective cases, screen protectors, chargers, cables, car accessories, batteries, and earphones. Visit us at our location in Ocean Grove, Geelong, for all your mobile repair needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute right-0 top-20 h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 rounded-full bg-brand/5 blur-3xl dark:bg-accent/5" />
      <div className="absolute left-0 bottom-20 h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 rounded-full bg-brand/5 blur-3xl dark:bg-accent/5" />
    </section>
  )
}
