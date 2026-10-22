import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingStats } from "@/components/landing/landing-stats"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingHow } from "@/components/landing/landing-how"
import { LandingCurriculum } from "@/components/landing/landing-curriculum"
import { LandingVerify } from "@/components/landing/landing-verify"
import { LandingFaq } from "@/components/landing/landing-faq"
import { LandingCta } from "@/components/landing/landing-cta"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingStats />
        <LandingFeatures />
        <LandingHow />
        <LandingCurriculum />
        <LandingVerify />
        <LandingFaq />
        <LandingCta />
      </main>
      <Footer />
    </div>
  )
}
