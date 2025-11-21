import { useEffect, useState } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import './HowItWorks.css'

interface Step {
  number: number
  icon: React.ReactNode
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: 1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    ),
    title: 'Upload Resume',
    description: 'Drag & drop your resume, certificates, reference letters and more.',
  },
  {
    number: 2,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    ),
    title: 'Search & Import Jobs',
    description: 'Browse job listings or manually import job descriptions.',
  },
  {
    number: 3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    title: 'Generate Letters',
    description: 'Our AI creates personalized cover letters in seconds for each application.',
  },
  {
    number: 4,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 6 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 6 22 6 22 12"></polyline>
      </svg>
    ),
    title: 'Track & Analyze',
    description: 'Monitor all applications in one dashboard. See who opened your email.',
  },
]

const HowItWorks = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.3, // 30% into viewport
    rootMargin: '0px',
    triggerOnce: true,
  })

  // Animate cards when section is visible
  const [cardsAnimated, setCardsAnimated] = useState(false)
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
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setCardsAnimated(true)
      }, 100)
    }
  }, [hasIntersected])

  return (
    <section id="how-it-works" className="how-it-works" ref={elementRef as React.RefObject<HTMLElement>}>
      <div className="container">
        <div className="steps-grid">
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0 // Cards 1 & 3 from left, 2 & 4 from right
            return (
              <div
                key={step.number}
                className={`step-card ${cardsAnimated ? 'animate-in' : ''} ${isLeft ? 'slide-from-left' : 'slide-from-right'}`}
                style={{
                  transitionDelay: isMobile 
                    ? `${index * 50}ms` 
                    : `${index * 100}ms`,
                }}
              >
                <div className="step-number-circle">
                  <span className="step-number">{step.number}</span>
                </div>
                <div
                  className={`step-icon ${cardsAnimated ? 'icon-animate-in' : ''}`}
                  style={{
                    transitionDelay: isMobile 
                      ? `${index * 50 + 100}ms` 
                      : `${index * 100 + 200}ms`,
                  }}
                >
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

