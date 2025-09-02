import Header from "../components/header"
import Hero from "../components/hero"
import Pricing from "../components/pricing"
import Reviews from "../components/reviews"
import Map from "../components/map"

export default function Home() {
  return (
    <main className="min-h-screen bg-body-background dark:bg-dark">
      <Header />
      <Hero />
      <Pricing />
      <Reviews />
      <Map />
    </main>
  )
}
