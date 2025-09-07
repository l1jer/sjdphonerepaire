import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full py-8 sm:py-12 mt-12 sm:mt-16 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-100/80 dark:via-gray-900/50 dark:to-gray-950/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col items-center justify-center">
                    {/* Logo & Links */}
                    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mb-6 sm:mb-8">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <span className="text-sm sm:text-base text-primary font-medium">SJD Tech Phone & Tablet Repairs</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                            <Link href="/#about" className="text-xs sm:text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                                About
                            </Link>
                            <Link href="/#pricing" className="text-xs sm:text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                                Pricing
                            </Link>
                            <Link href="/#reviews" className="text-xs sm:text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                                Reviews
                            </Link>
                            <Link href="/#map" className="text-xs sm:text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                                Find Us
                            </Link>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-8" />

                    {/* Credit & Copyright */}
                    <div className="flex flex-col items-center space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Crafted by{' '}
                            <Link
                                href="https://digolas-forge.com/"
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
                            >
                                Digolas Forge
                            </Link>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            © {currentYear} SJD Tech Phone & Tablet Repairs. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}