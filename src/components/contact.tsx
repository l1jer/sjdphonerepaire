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
    <section id="contact" className="bg-white py-24 dark:bg-dark/50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-dark dark:text-white">
            Contact Us
          </h2>
          <p className="mx-auto max-w-2xl text-body dark:text-body">
            Get in touch with us for a free consultation. We will get back to you as soon as possible.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-dark dark:text-white"
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
                  className="w-full rounded-lg border border-body/10 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark/10 dark:bg-dark dark:text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-dark dark:text-white"
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
                  className="w-full rounded-lg border border-body/10 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark/10 dark:bg-dark dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-dark dark:text-white"
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
                  className="w-full rounded-lg border border-body/10 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark/10 dark:bg-dark dark:text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="device"
                  className="mb-2 block text-sm font-medium text-dark dark:text-white"
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
                  className="w-full rounded-lg border border-body/10 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark/10 dark:bg-dark dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="issue"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
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
                className="w-full rounded-lg border border-body/10 bg-white px-4 py-3 text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark/10 dark:bg-dark dark:text-white"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="rounded-full bg-primary px-8 py-3 text-lg font-medium text-white hover:bg-primary-hover"
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