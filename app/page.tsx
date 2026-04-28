import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { Footer } from "@/components/layout/footer"
import { LandingStats } from "@/components/landing/landing-stats"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <Footer />
    </div>
  )
}