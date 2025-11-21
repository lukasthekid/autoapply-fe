import { useState, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import './FinalCTA.css'

const FinalCTA = () => {
  const { isAuthenticated } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup')
  const [isAnimating, setIsAnimating] = useState(false)
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true,
  })
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (hasIntersected) {
      setTimeout(() => {
        setIsAnimated(true)
      }, 200)
    }
  }, [hasIntersected])

  const handleCTAClick = () => {
    // Click animation feedback
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
    }, 150)

    if (isAuthenticated) {
      // Handle authenticated user action
      console.log('Get Started for Free clicked (authenticated)')
    } else {
      setAuthModalMode('signup')
      setIsAuthModalOpen(true)
    }
  }

  return (
    <>
      <section id="final-cta" className="final-cta" ref={elementRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <div className="final-cta-content">
            <h2 className={`final-cta-headline ${isAnimated ? 'animate-in' : ''}`}>
              Ready to transform your job search?
            </h2>
            <p className={`final-cta-subheadline ${isAnimated ? 'animate-in' : ''}`}>
              Join thousands of job seekers applying smarter, not harder.
            </p>
            <button
              className={`final-cta-button ${isAnimated ? 'animate-in' : ''} ${isAnimating ? 'clicking' : ''}`}
              onClick={handleCTAClick}
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  )
}

export default FinalCTA

