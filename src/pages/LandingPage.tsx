import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Templates from '@/components/sections/Templates'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/Pricing'
import FAQ from '@/components/sections/FAQ'
import Footer from '@/components/layout/Footer'
import AmbientBackground from '@/components/AmbientBackground'
import MouseAmbientLight from '@/components/MouseAmbientLight'

const LandingPage = () => {
  return (
    <div className="landing-page">
      <AmbientBackground />
      <MouseAmbientLight />
      <Header />
      <main>
        <Hero />
        <Templates />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage

