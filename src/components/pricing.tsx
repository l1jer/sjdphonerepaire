import Link from "next/link"

const repairs = [
  {
    device: "Phone Repair",
    services: [
      { name: "LCD Screen", price: "from $55" },
      { name: "Battery Repair", price: "from $55" },
      { name: "Back Camera", price: "from $60" },
      { name: "Camera Lens", price: "from $50" },
      { name: "Front Camera", price: "from $55" },
      { name: "Charging Port", price: "from $80" },
      { name: "Water Damaged", price: "from $50" },
      { name: "Loud Speaker", price: "from $70" },
      { name: "Back Cover", price: "from $60" },
      { name: "Other Repairs", price: "from $70" },
    ],
  },
  {
    device: "iPad & Tablet Repair",
    services: [
      { name: "LCD Replacement", price: "from $150" },
      { name: "Touch Glass", price: "from $90" },
      { name: "Back Camera", price: "from $140" },
      { name: "Front Camera", price: "from $140" },
      { name: "Camera Lens", price: "from $60" },
      { name: "Charging Port", price: "from $150" },
      { name: "Battery Repair", price: "from $120" },
      { name: "Loud Speaker", price: "from $100" },
      { name: "Home Button", price: "from $90" },
      { name: "Other Repairs", price: "from $70" },
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-background-light dark:bg-background-dark py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-brand dark:text-text-inverse">
            Phone & Tablet Repair Pricing Ocean Grove
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-text-dark dark:text-text-inverse/80 leading-relaxed">
            Transparent pricing for all phone and tablet repairs in Ocean Grove, Geelong. All repairs include a 90-day warranty and satisfaction guarantee. Call us for a detailed quote for your specific device model.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-2">
          {repairs.map((category) => (
            <div
              key={category.device}
              className="rounded-2xl border border-neutral-300 bg-white p-6 sm:p-8 shadow-lg transition-all hover:shadow-xl dark:border-neutral-700 dark:bg-background-darker"
            >
              <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-brand dark:text-text-inverse">
                {category.device}
              </h3>
              <div className="grid gap-2 sm:gap-3">
                {category.services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 sm:px-4 sm:py-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
                  >
                    <span className="text-xs sm:text-sm font-medium text-text-dark dark:text-text-inverse/90">{service.name}</span>
                    <span className="text-xs sm:text-sm font-bold text-brand dark:text-accent">{service.price}</span>
                  </div>
                ))}
              </div>
              <Link
                href="tel:0410422772"
                className="mt-6 sm:mt-8 block rounded-full bg-brand px-6 py-3 text-center text-sm sm:text-base font-medium text-white transition-colors hover:bg-brand-light dark:bg-accent dark:hover:bg-accent-light"
              >
                Call Us Now
              </Link>
            </div>
          ))}
        </div>

        <Link href="tel:0410422772">
          <div className="mt-12 sm:mt-16 rounded-2xl bg-white/50 p-6 sm:p-8 text-center shadow-lg transition-all hover:shadow-xl dark:bg-background-darker/50">
            <p className="text-base sm:text-lg text-text-dark dark:text-text-inverse">
              Need a repair not listed here? Call us for a custom quote.
            </p>
          </div>
        </Link>
        </div>
    </section>
  )
}