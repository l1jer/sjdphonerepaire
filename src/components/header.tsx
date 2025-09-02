"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  // const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-body/10 bg-body-background/80 backdrop-blur-xl dark:border-dark/10 dark:bg-dark/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          {/* Company logo, accessible and responsive */}
          <img
            src="/sjd-phone-repair-logo.webp"
            alt="SJD Phone & Tablet Repairs logo"
            className="h-20 w-20 object-contain"
            loading="lazy"
            decoding="async"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#pricing" className="text-dark hover:text-primary dark:text-body dark:hover:text-primary">
            Pricing
          </Link>
          <Link href="#reviews" className="text-dark hover:text-primary dark:text-body dark:hover:text-primary">
            Reviews
          </Link>
          <Link href="#map" className="text-dark hover:text-primary dark:text-body dark:hover:text-primary">
            Find Us
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="tel:0410422772"
            className="cursor-pointer transition-all bg-[#a31d1d] dark:bg-[#fef9e1e6] text-[#e5e7eb] dark:text-[#2c1810] px-6 py-2 rounded-lg border-b-[4px] border-[#8a1919] dark:border-[#8b7b3d] hover:brightness-110 dark:hover:brightness-90 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
          >
            Call Us Now
          </Link>
        </div>
      </div>
    </header>
  )
}