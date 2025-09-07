import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from '@/components/footer'
import ThemeToggle from '@/components/ThemeToggle'
import ScrollToTop from '@/components/ScrollToTop'
// import Nav from '@/components/nav'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SJD Tech Phone & Tablet Repairs | Professional Mobile Repair Ocean Grove",
  description: "Expert phone and tablet repair services in Ocean Grove, Geelong. Fast, reliable repairs for iPhone, Samsung, iPad with 90-day warranty. Screen, battery, camera repairs from $50.",
  keywords: "phone repair Ocean Grove, tablet repair Geelong, iPhone repair, Samsung repair, iPad repair, mobile phone repair, screen replacement, battery replacement, camera repair, charging port repair, water damage repair",
  authors: [{ name: "SJD Tech" }],
  creator: "SJD Tech Phone & Tablet Repairs",
  publisher: "SJD Tech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.sjdtech.com.au'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "SJD Tech Phone & Tablet Repairs | Professional Mobile Repair Ocean Grove",
    description: "Expert phone and tablet repair services in Ocean Grove, Geelong. Fast, reliable repairs for iPhone, Samsung, iPad with 90-day warranty. Screen, battery, camera repairs from $50.",
    url: 'https://www.sjdtech.com.au',
    siteName: 'SJD Tech Phone & Tablet Repairs',
    images: [
      {
        url: '/hero-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Professional phone repair technician working on mobile device',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SJD Tech Phone & Tablet Repairs | Professional Mobile Repair Ocean Grove",
    description: "Expert phone and tablet repair services in Ocean Grove, Geelong. Fast, reliable repairs for iPhone, Samsung, iPad with 90-day warranty.",
    images: ['/hero-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://www.sjdtech.com.au/" />
        <meta name="geo.region" content="AU-VIC" />
        <meta name="geo.placename" content="Ocean Grove" />
        <meta name="geo.position" content="-38.2508;144.5225" />
        <meta name="ICBM" content="-38.2508, 144.5225" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://www.sjdtech.com.au/#business",
              "name": "SJD Tech Phone & Tablet Repairs",
              "alternateName": "SJD Tech",
              "description": "Professional phone and tablet repair services in Ocean Grove, Geelong. Expert repairs for iPhone, Samsung, iPad with 90-day warranty.",
              "url": "https://www.sjdtech.com.au",
              "telephone": "+61410422772",
              "email": "sjdphonerepair@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Tenancy 7C Kingston Village Shopping Centre, 122-160 Grubb Road",
                "addressLocality": "Ocean Grove",
                "addressRegion": "VIC",
                "postalCode": "3226",
                "addressCountry": "AU"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -38.2508,
                "longitude": 144.5225
              },
              "openingHours": [
                "Mo-Fr 09:00-17:30",
                "Sa 09:00-17:00", 
                "Su 10:00-16:00"
              ],
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": -38.2508,
                  "longitude": 144.5225
                },
                "geoRadius": "50000"
              },
              "priceRange": "$50-$200",
              "image": "https://www.sjdtech.com.au/hero-image.jpg",
              "logo": "https://www.sjdtech.com.au/sjd-phone-repair-logo.webp",
              "sameAs": [],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Phone & Tablet Repair Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Phone Screen Repair",
                      "description": "LCD screen replacement for all phone models"
                    },
                    "priceSpecification": {
                      "@type": "PriceSpecification",
                      "price": "55",
                      "priceCurrency": "AUD",
                      "valueAddedTaxIncluded": true
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Tablet Screen Repair",
                      "description": "LCD replacement for iPads and Android tablets"
                    },
                    "priceSpecification": {
                      "@type": "PriceSpecification",
                      "price": "150",
                      "priceCurrency": "AUD",
                      "valueAddedTaxIncluded": true
                    }
                  }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "87",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <Navigation /> */}
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ThemeToggle />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
