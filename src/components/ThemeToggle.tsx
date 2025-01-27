"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="fixed bottom-6 left-6 z-50 p-2 rounded-full 
                bg-white/80 dark:bg-neutral-800/80 
                backdrop-blur-md
                shadow-lg dark:shadow-neutral-950/50
                border border-neutral-200 dark:border-neutral-700
                transition-all duration-300 ease-in-out
                hover:scale-110 active:scale-95
                group"
            aria-label="Toggle theme"
        >
            <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Sun icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className={`w-5 h-5 text-amber-500 dark:text-neutral-400 transition-all duration-300
                        ${theme === 'dark' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
                        absolute`}
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>

                {/* Moon icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className={`w-5 h-5 text-neutral-400 dark:text-amber-300 transition-all duration-300
                        ${theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                        absolute`}
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </div>
        </button>
    )
} 