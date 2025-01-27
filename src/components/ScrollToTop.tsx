"use client"

import { useEffect, useState } from "react"

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const pricingSection = document.getElementById('pricing')

        const toggleVisibility = () => {
            if (pricingSection) {
                const pricingOffset = pricingSection.offsetTop
                const scrolled = window.scrollY
                setIsVisible(scrolled > pricingOffset)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full 
        bg-brand dark:bg-accent
        shadow-lg 
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
            aria-label="Scroll to top"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white dark:text-background-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </button>
    )
} 