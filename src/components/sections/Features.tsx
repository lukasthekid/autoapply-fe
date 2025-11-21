import { useEffect, useState, useRef } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import './Features.css'

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  iconColor: string
  subPoints: string[]
}

const features: Feature[] = [
  {
    title: 'Unlimited Information Storage',
    description: 'Upload as much information as you want. Your profile grows with you.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
    iconColor: '#4f46e5', // Indigo-600
    subPoints: ['Resume', 'Skills', 'Work samples', 'Certifications'],
  },
  {
    title: 'AI-Powered Personalization',
    description: 'Our LLM analyzes each job description and creates uniquely tailored cover letters.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
        <line x1="9" y1="1" x2="9" y2="4"></line>
        <line x1="15" y1="1" x2="15" y2="4"></line>
        <line x1="9" y1="20" x2="9" y2="23"></line>
        <line x1="15" y1="20" x2="15" y2="23"></line>
        <line x1="20" y1="9" x2="23" y2="9"></line>
        <line x1="20" y1="14" x2="23" y2="14"></line>
        <line x1="1" y1="9" x2="4" y2="9"></line>
        <line x1="1" y1="14" x2="4" y2="14"></line>
      </svg>
    ),
    iconColor: '#14b8a6', // Teal-500
    subPoints: ['Keywords optimized', 'Tone adaptive', 'ATS-friendly'],
  },
  {
    title: 'Professional Templates',
    description: 'Select from industry standard PDF Templates',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    iconColor: '#f59e0b', // Amber-500
    subPoints: ['No distractions', '350+ contributors'],
  },
  {
    title: 'Job Search Integration',
    description: 'Access job boards directly in the platform or import manually.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    ),
    iconColor: '#9333ea', // Purple-500
    subPoints: ['LinkedIn', 'Indeed', 'Custom URLs'],
  },
  {
    title: 'Application Tracking Dashboard',
    description: 'See all applications in one place. Track opens, responses, and follow-ups.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
    iconColor: '#f97316', // Orange-500
    subPoints: ['Response status', 'Follow-up scheduling'],
  },
  {
    title: 'One-Click Apply',
    description: 'Click once to generate Cover Letters for dozens of applications',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    iconColor: '#3b82f6', // Blue-500
    subPoints: ['Auto generation', 'Instant download'],
  },
]

const Features = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true,
  })
  const sectionRef = useRef<HTMLElement>(null)
  const [isAnimated, setIsAnimated] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (hasIntersected) {
      setTimeout(() => {
        setIsAnimated(true)
      }, 200)
    }
  }, [hasIntersected])

  // Parallax scroll effect (0.5x multiplier) - disabled on mobile
  useEffect(() => {
    if (!isAnimated) return // Only apply parallax after initial animation
    
    // Disable parallax on mobile devices
    if (window.innerWidth < 768) return

    const section = sectionRef.current
    if (!section) return

    let rafId: number | null = null
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect()
          const windowHeight = window.innerHeight
          const sectionTop = rect.top
          const sectionHeight = rect.height

          // Calculate if section is in viewport
          if (sectionTop < windowHeight && sectionTop + sectionHeight > -sectionHeight) {
            // Calculate scroll progress relative to viewport center
            const viewportCenter = windowHeight / 2
            const sectionCenter = sectionTop + sectionHeight / 2
            const distanceFromCenter = (viewportCenter - sectionCenter) / windowHeight
            
            // Apply parallax (0.5x multiplier - moves slower than scroll)
            const parallaxOffset = distanceFromCenter * 40 * 0.5 // 0.5x multiplier
            
            const featureCards = section.querySelectorAll('.feature-card.animate-in') as NodeListOf<HTMLElement>
            featureCards.forEach((card) => {
              // Check if card is being hovered
              if (!card.matches(':hover')) {
                card.style.setProperty('--parallax-offset', `${parallaxOffset}px`)
              }
            })
          }
          ticking = false
        })
        ticking = true
      }
    }

    // Use scroll event with throttling
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [isAnimated])

  return (
    <section 
      id="features" 
      className="features" 
      ref={(node) => {
        if (node) {
          sectionRef.current = node
          ;(elementRef as React.MutableRefObject<HTMLElement>).current = node
        }
      }}
    >
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card ${isAnimated ? 'animate-in' : ''}`}
              style={{
                transitionDelay: isMobile ? `${index * 25}ms` : `${index * 50}ms`,
                '--icon-color': feature.iconColor,
              } as React.CSSProperties}
            >
              <div 
                className={`feature-icon ${isAnimated ? 'icon-animate-in' : ''}`}
                style={{ 
                  color: feature.iconColor,
                  transitionDelay: isMobile ? `${index * 25 + 100}ms` : `${index * 50 + 200}ms`,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              {feature.subPoints && feature.subPoints.length > 0 && (
                <ul className="feature-subpoints">
                  {feature.subPoints.map((point, pointIndex) => (
                    <li key={pointIndex}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

