import Hero from "@/components/landing/Hero"
import Problem from "@/components/landing/Problem"
import Features from "@/components/landing/Features"
import Pricing from "@/components/landing/Pricing"
import FAQ from "@/components/landing/FAQ"
import FinalCta from "@/components/landing/FinalCta"
import Waitlist from "@/components/landing/Waitlist"
import config from "@/config"

export const metadata = {
  title: config.landing.hero.title,
  description: config.landing.hero.subtitle,
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      {config.features.pricing && <Pricing />}
      <FAQ />
      <FinalCta />
      {config.features.waitlist && <Waitlist />}
    </>
  )
}
