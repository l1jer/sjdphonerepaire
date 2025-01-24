"use client"

import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

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
          <span className="text-2xl font-bold text-primary">SJD</span>
          <span className="text-xl font-medium">Phone Repair</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#services" className="text-dark hover:text-primary dark:text-body dark:hover:text-primary">
            Services
          </Link>
          <Link href="#pricing" className="text-dark hover:text-primary dark:text-body dark:hover:text-primary">
            Pricing
          </Link>
          <Link href="#reviews" className="text-dark hover:text-primary dark:text-body dark:hover:text-primary">
            Reviews
          </Link>
          <Link href="#contact" className="text-dark hover:text-primary dark:text-body dark:hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 hover:bg-body/10 dark:hover:bg-dark-text/10"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
          <Link
            href="#contact"
            className="rounded-full bg-primary px-4 py-2 text-white hover:bg-primary-hover"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  )
}