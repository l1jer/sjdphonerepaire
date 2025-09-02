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
  title: "SJD Tech Phone & Tablet Repairs",
  description: "Professional phone & tablet repair services in Sydney",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
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
