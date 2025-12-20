import { lazy, Suspense } from 'react'
import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// Lazy load below-the-fold components for better performance
const SocialProof = lazy(() => import('@/components/sections/SocialProof'))
const ProblemSolution = lazy(() => import('@/components/sections/ProblemSolution'))
const Features = lazy(() => import('@/components/sections/Features'))
const HowItWorks = lazy(() => import('@/components/sections/HowItWorks'))
const ComparisonTable = lazy(() => import('@/components/sections/ComparisonTable'))
const Testimonials = lazy(() => import('@/components/sections/Testimonials'))
const Pricing = lazy(() => import('@/components/sections/Pricing'))
const FAQ = lazy(() => import('@/components/sections/FAQ'))
const FinalCTA = lazy(() => import('@/components/sections/FinalCTA'))
const Footer = lazy(() => import('@/components/layout/Footer'))

// Lazy loaded section wrapper that only loads when visible
const LazySection = ({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode | null
}) => {
  const { elementRef, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.01,
    rootMargin: '200px',
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
            name: 'Resumr - AI-Powered Job Application Platform',
            description: 'Apply to 100+ jobs in hours with AI-generated cover letters. Upload your resume, search jobs, and track applications all in one place. Start free today.',
            url: 'https://project100x.run.place/',
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Resumr',
              applicationCategory: 'JobApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            },
          }),
        }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Header - Fixed at top */}
        <Header />
        
        <main>
          {/* Hero Section - Always visible immediately */}
          <Hero />

          {/* Social Proof - Load quickly */}
          <LazySection>
            <SocialProof />
          </LazySection>

          {/* Problem vs Solution */}
          <LazySection>
            <ProblemSolution />
          </LazySection>

          {/* Features Section */}
          <LazySection>
            <Features />
          </LazySection>

          {/* How It Works Section */}
          <LazySection>
            <HowItWorks />
          </LazySection>

          {/* Comparison Table */}
          <LazySection>
            <ComparisonTable />
          </LazySection>

          {/* Testimonials Section */}
          <LazySection>
            <Testimonials />
          </LazySection>

          {/* Pricing Section */}
          <LazySection>
            <Pricing />
          </LazySection>

          {/* FAQ Section */}
          <LazySection>
            <FAQ />
          </LazySection>

          {/* Final CTA Section */}
          <LazySection>
            <FinalCTA />
          </LazySection>
        </main>

        {/* Footer */}
        <LazySection fallback={null}>
          <Footer />
        </LazySection>
      </div>
    </>
  )
}

export default LandingPage
