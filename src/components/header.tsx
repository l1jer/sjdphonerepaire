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
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          {/* Company logo, bigger on mobile */}
          <img
            src="/sjd-phone-repair-logo.webp"
            alt="SJD Tech Phone & Tablet Repairs - Professional mobile repair services in Ocean Grove, Geelong"
            className="h-16 w-16 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
            loading="lazy"
            decoding="async"
            width="80"
            height="80"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link href="#about" className="text-sm lg:text-base text-dark hover:text-primary dark:text-body dark:hover:text-primary transition-colors">
            About
          </Link>
          <Link href="#pricing" className="text-sm lg:text-base text-dark hover:text-primary dark:text-body dark:hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="#reviews" className="text-sm lg:text-base text-dark hover:text-primary dark:text-body dark:hover:text-primary transition-colors">
            Reviews
          </Link>
          <Link href="#map" className="text-sm lg:text-base text-dark hover:text-primary dark:text-body dark:hover:text-primary transition-colors">
            Find Us
          </Link>
        </nav>

        <div className="flex items-center">
          <Link
            href="tel:0410422772"
            className="cursor-pointer transition-all bg-[#a31d1d] dark:bg-[#fef9e1e6] text-[#e5e7eb] dark:text-[#2c1810] px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg border-b-[4px] border-[#8a1919] dark:border-[#8b7b3d] hover:brightness-110 dark:hover:brightness-90 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] text-xs sm:text-sm md:text-base font-medium"
          >
            <span className="hidden sm:inline">Call Us Now</span>
            <span className="sm:hidden">CALL US</span>
          </Link>
        </div>
      </div>
    </header>
  )
}