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
    <section id="pricing" className="bg-body-background py-24 dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-dark dark:text-white">
            Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-body dark:text-body">
            All repairs come with a 90-day warranty and our satisfaction guarantee. Contact us for a detailed quote for your specific model.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {repairs.map((category) => (
            <div
              key={category.device}
              className="rounded-2xl border border-body/10 bg-white p-8 shadow-lg dark:border-dark/10 dark:bg-dark/50"
            >
              <h3 className="mb-6 text-2xl font-bold text-dark dark:text-white">
                {category.device}
              </h3>
              <div className="space-y-4">
                {category.services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between border-b border-body/10 pb-4 dark:border-dark/10"
                  >
                    <span className="text-dark dark:text-body">{service.name}</span>
                    <span className="font-medium text-primary">${service.price}</span>
                  </div>
                ))}
              </div>
              <Link
                href="#contact"
                className="mt-8 block rounded-full bg-primary px-6 py-3 text-center font-medium text-white hover:bg-primary-hover"
              >
                Book Repair
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-primary/5 p-8 text-center dark:bg-primary/10">
          <p className="text-lg text-dark dark:text-white">
            Need a repair not listed here?{" "}
            <Link href="#contact" className="font-medium text-primary hover:underline">
              Contact us
            </Link>{" "}
            for a custom quote.
          </p>
        </div>
      </div>
    </section>
  )
}