import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full py-12 mt-16 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-100/80 dark:via-gray-900/50 dark:to-gray-950/80 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center">
                    {/* Logo & Links */}
                    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mb-8">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <span className="text-xl font-bold text-primary">SJD</span>
                            <span className="text-lg font-medium">Phone Repair</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link href="#services" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                                Services
                            </Link>
                            <Link href="#pricing" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                                Pricing
                            </Link>
                            <Link href="#contact" className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                                Contact
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
                                href="https://jerryli.me/"
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-medium"
                            >
                                Jerry LI
                            </Link>
                            {' '}at{' '}
                            <span className="text-primary-600 dark:text-primary-400 font-medium">
                                Digolas Forge
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            © {currentYear} SJD Phone Repair. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}