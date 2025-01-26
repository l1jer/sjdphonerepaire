"use client"

import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    issue: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log(formData)
  }

  return (
    <section id="contact" className="bg-background-light dark:bg-background-dark py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-brand dark:text-text-inverse">
            Contact Us
          </h2>
          <p className="mx-auto max-w-2xl text-text-dark dark:text-text-inverse/80">
            Get in touch with us for a free consultation. We will get back to you as soon as possible.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-300 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-neutral-700 dark:bg-background-darker">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-brand dark:text-text-inverse"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-text-dark placeholder-text-dark/50 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors dark:border-neutral-700 dark:bg-background-dark dark:text-text-inverse dark:placeholder-text-inverse/30 dark:focus:border-accent dark:focus:ring-accent"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-brand dark:text-text-inverse"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-text-dark placeholder-text-dark/50 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors dark:border-neutral-700 dark:bg-background-dark dark:text-text-inverse dark:placeholder-text-inverse/30 dark:focus:border-accent dark:focus:ring-accent"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-brand dark:text-text-inverse"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-text-dark placeholder-text-dark/50 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors dark:border-neutral-700 dark:bg-background-dark dark:text-text-inverse dark:placeholder-text-inverse/30 dark:focus:border-accent dark:focus:ring-accent"
                  placeholder="0412 345 678"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="device"
                  className="mb-2 block text-sm font-medium text-brand dark:text-text-inverse"
                >
                  Device Model
                </label>
                <input
                  type="text"
                  id="device"
                  value={formData.device}
                  onChange={(e) =>
                    setFormData({ ...formData, device: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-text-dark placeholder-text-dark/50 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors dark:border-neutral-700 dark:bg-background-dark dark:text-text-inverse dark:placeholder-text-inverse/30 dark:focus:border-accent dark:focus:ring-accent"
                  placeholder="iPhone 13 Pro"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="issue"
                className="mb-2 block text-sm font-medium text-brand dark:text-text-inverse"
              >
                Describe the Issue
              </label>
              <textarea
                id="issue"
                value={formData.issue}
                onChange={(e) =>
                  setFormData({ ...formData, issue: e.target.value })
                }
                rows={4}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-text-dark placeholder-text-dark/50 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors dark:border-neutral-700 dark:bg-background-dark dark:text-text-inverse dark:placeholder-text-inverse/30 dark:focus:border-accent dark:focus:ring-accent"
                placeholder="Please describe the issue with your device..."
                required
              />
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                className="rounded-full bg-brand px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-brand-light dark:bg-accent dark:hover:bg-accent-light"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}