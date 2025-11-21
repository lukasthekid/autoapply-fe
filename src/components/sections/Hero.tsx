import { useState, useEffect, useRef } from 'react'
import './Hero.css'
import AuthModal from '@/components/AuthModal'

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup')
  const [isAnimated, setIsAnimated] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  // Trigger animations on mount (delayed on mobile to reduce initial motion)
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      // Small delay on mobile to reduce initial animation overload
      setTimeout(() => {
        setIsAnimated(true)
      }, 50)
    } else {
      setIsAnimated(true)
    }
  }, [])

  // Mouse parallax effect for background (disabled on mobile)
  useEffect(() => {
    // Disable parallax on mobile devices
    if (window.innerWidth < 768) return

    const heroElement = heroRef.current
    const parallaxElement = parallaxRef.current
    if (!heroElement || !parallaxElement) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let rafId: number | null = null

    const animate = () => {
      // Smooth interpolation for parallax effect
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15
      
      parallaxElement.style.transform = `translate(${currentX}%, ${currentY}%)`
      
      // Continue animation if there's still movement
      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        rafId = requestAnimationFrame(animate)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      
      // Calculate normalized position (-1 to 1)
      const x = (clientX / innerWidth) * 2 - 1
      const y = (clientY / innerHeight) * 2 - 1
      
      // Update target values for parallax shift (-3% to 3%)
      targetX = x * 3
      targetY = y * 3
      
      // Start animation loop if not already running
      if (!rafId) {
        rafId = requestAnimationFrame(animate)
      }
    }

    const handleMouseLeave = () => {
      targetX = 0
      targetY = 0
      if (!rafId) {
        rafId = requestAnimationFrame(animate)
      }
    }

    heroElement.addEventListener('mousemove', handleMouseMove)
    heroElement.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      heroElement.removeEventListener('mousemove', handleMouseMove)
      heroElement.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <>
      <section className="hero" ref={heroRef}>
        <div className="hero-parallax-bg" ref={parallaxRef}>
          <div className="hero-ambient-glow hero-ambient-glow-1" />
          <div className="hero-ambient-glow hero-ambient-glow-2" />
          <div className="hero-ambient-glow hero-ambient-glow-3" />
        </div>
        <div className="container">
          <div className="hero-content">
            {/* Left Side: Text Content */}
            <div className="hero-left">
              <h1 className={`hero-title ${isAnimated ? 'animate-in' : ''}`}>
                Apply to dozens of jobs with personalized cover letters in hours, not days
              </h1>
              <p className={`hero-subtitle ${isAnimated ? 'animate-in' : ''}`}>
                Upload your resume once. Generate tailored cover letters with AI. Track all your applications instantly. No more manual copy-pasting.
              </p>
              <div className={`hero-cta ${isAnimated ? 'animate-in' : ''}`}>
                <button 
                  className="hero-cta-primary"
                  onClick={() => {
                    setAuthModalMode('signup')
                    setIsAuthModalOpen(true)
                  }}
                >
                  Get Started Free
                </button>
                <button 
                  className="hero-cta-secondary"
                  onClick={() => {
                    window.location.href = '#features'
                  }}
                >
                  More Information
                </button>
              </div>
              <div className={`hero-trust-badge ${isAnimated ? 'animate-in' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Your data is secure. We never share it with 3rd parties.</span>
              </div>
            </div>

            {/* Right Side: Visual Element */}
            <div className={`hero-right ${isAnimated ? 'animate-in' : ''}`}>
              <div className="hero-visual">
                <img 
                  src="/product_screenshot_mockup.png" 
                  alt="AutoApply Dashboard showing application tracking and statistics"
                  className="hero-screenshot"
                />
              </div>
            </div>
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

export default Hero

