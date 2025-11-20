import { lazy, Suspense } from 'react'
import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'
import AmbientBackground from '@/components/AmbientBackground'
import MouseAmbientLight from '@/components/MouseAmbientLight'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// Lazy load below-the-fold components for better performance
const Templates = lazy(() => import('@/components/sections/Templates'))
const Features = lazy(() => import('@/components/sections/Features'))
const Testimonials = lazy(() => import('@/components/sections/Testimonials'))
const Pricing = lazy(() => import('@/components/sections/Pricing'))
const FAQ = lazy(() => import('@/components/sections/FAQ'))
const Footer = lazy(() => import('@/components/layout/Footer'))

// Lazy loaded section wrapper that only loads when visible
const LazySection = ({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode | null
}) => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '100px',
    triggerOnce: true,
  })

  return (
    <div ref={elementRef}>
      {hasIntersected ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  )
}

const LandingPage = () => {
  return (
    <>
      {/* SEO: Structured data for the page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'AutoApply - AI-Powered Cover Letter Generator',
            description: 'Generate personalized cover letters in seconds with AI. Upload your resume, paste job descriptions, and create professional cover letters tailored to each application.',
            url: 'https://project100x.run.place/',
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'AutoApply',
              applicationCategory: 'JobApplication',
              operatingSystem: 'Web',
            },
          }),
        }}
      />
      
      <div className="landing-page">
        <AmbientBackground />
        <MouseAmbientLight />
        <Header />
        <main>
          <Hero />
          <LazySection>
            <Templates />
          </LazySection>
          <LazySection>
            <Features />
          </LazySection>
          <LazySection>
            <Testimonials />
          </LazySection>
          <LazySection>
            <Pricing />
          </LazySection>
          <LazySection>
            <FAQ />
          </LazySection>
        </main>
        <LazySection fallback={null}>
          <Footer />
        </LazySection>
      </div>
    </>
  )
}

export default LandingPage

