import Link from "next/link"

const repairs = [
  {
    device: "iPhone",
    services: [
      { name: "Screen Replacement", price: "89" },
      { name: "Battery Replacement", price: "69" },
      { name: "Charging Port", price: "59" },
      { name: "Back Glass", price: "79" },
    ],
  },
  {
    device: "Samsung",
    services: [
      { name: "Screen Replacement", price: "99" },
      { name: "Battery Replacement", price: "79" },
      { name: "Charging Port", price: "69" },
      { name: "Back Glass", price: "89" },
    ],
  },
  {
    device: "Other Brands",
    services: [
      { name: "Screen Replacement", price: "from 79" },
      { name: "Battery Replacement", price: "from 59" },
      { name: "Charging Port", price: "from 49" },
      { name: "Back Glass", price: "from 69" },
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="bg-background-light dark:bg-background-dark py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-brand dark:text-text-inverse">
            Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-text-dark dark:text-text-inverse/80">
            All repairs come with a 90-day warranty and our satisfaction guarantee. Contact us for a detailed quote for your specific model.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {repairs.map((category) => (
            <div
              key={category.device}
              className="rounded-2xl border border-neutral-300 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-neutral-700 dark:bg-background-darker"
            >
              <h3 className="mb-6 text-2xl font-bold text-brand dark:text-text-inverse">
                {category.device}
              </h3>
              <div className="space-y-4">
                {category.services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between border-b border-neutral-200 pb-4 last:border-0 dark:border-neutral-700"
                  >
                    <span className="text-text-dark dark:text-text-inverse/90">{service.name}</span>
                    <span className="font-medium text-brand dark:text-accent">${service.price}</span>
                  </div>
                ))}
              </div>
              <Link
                href="#contact"
                className="mt-8 block rounded-full bg-brand px-6 py-3 text-center font-medium text-white transition-colors hover:bg-brand-light dark:bg-accent dark:hover:bg-accent-light"
              >
                Book Repair
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-white/50 p-8 text-center shadow-lg transition-all hover:shadow-xl dark:bg-background-darker/50">
          <p className="text-lg text-text-dark dark:text-text-inverse">
            Need a repair not listed here?{" "}
            <Link href="#contact" className="font-medium text-brand transition-colors hover:text-brand-light dark:text-accent dark:hover:text-accent-light">
              Contact us
            </Link>{" "}
            for a custom quote.
          </p>
        </div>
      </div>
    </section>
  )
}