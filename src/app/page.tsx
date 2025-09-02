import Header from "../components/header"
import Hero from "../components/hero"
import About from "../components/about"
import Pricing from "../components/pricing"
import Reviews from "../components/reviews"
import Map from "../components/map"

export default function Home() {
  return (
    <main className="min-h-screen bg-body-background dark:bg-dark">
      <Header />
      <Hero />
      <About />
      <Pricing />
      <Reviews />
      <Map />
    </main>
  )
}
