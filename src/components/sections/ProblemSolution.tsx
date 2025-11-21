import { useEffect, useState, useRef } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import './ProblemSolution.css'

const problemItems = [
  'Spend 30+ minutes per application',
  'Rewrite cover letter for each job',
  'Lose track of where you applied',
  'Forget to follow up',
]

const solutionItems = [
  'Apply in seconds with AI personalization',
  'One resume, unlimited applications',
  'Automatic application tracking',
  'Smart follow-up reminders',
]

const ProblemSolution = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver<HTMLElement>({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true,
  })
  
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (hasIntersected) {
      setTimeout(() => {
        setIsAnimated(true)
      }, 200)
    }
  }, [hasIntersected])

  // Parallax effect on scroll
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionTop = rect.top
      const sectionHeight = rect.height

      // Calculate if section is in viewport
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Calculate scroll progress (0 to 1) - centered around section middle
        const sectionMiddle = sectionTop + sectionHeight / 2
        const viewportMiddle = windowHeight / 2
        const distanceFromCenter = (viewportMiddle - sectionMiddle) / windowHeight
        
        // Problem side moves 5px slower, solution side moves normal speed
        // This creates depth effect
        const problemOffset = distanceFromCenter * 5
        const solutionOffset = distanceFromCenter * 10
        
        const problemSide = section.querySelector('.problem-side') as HTMLElement
        const solutionSide = section.querySelector('.solution-side') as HTMLElement
        
        if (problemSide) {
          problemSide.style.transform = `translateY(${problemOffset}px)`
        }
        if (solutionSide) {
          solutionSide.style.transform = `translateY(${-solutionOffset}px)`
        }
      }
    }

    // Use requestAnimationFrame for smooth parallax
    let rafId: number | null = null
    const updateParallax = () => {
      handleScroll()
      rafId = requestAnimationFrame(updateParallax)
    }

    // Start animation when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          rafId = requestAnimationFrame(updateParallax)
        } else {
          if (rafId !== null) {
            cancelAnimationFrame(rafId)
            rafId = null
          }
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(section)

    // Cleanup
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      observer.disconnect()
    }
  }, [])

  return (
    <section
      id="problem-solution"
      className="problem-solution"
      ref={(node) => {
        if (node) {
          sectionRef.current = node
          ;(elementRef as React.MutableRefObject<HTMLElement | null>).current = node
        }
      }}
    >
      <div className="container">
        <div className="problem-solution-grid">
          {/* Left Side: Problem */}
          <div className="problem-side">
            <h2 className="problem-headline">Job searching is broken</h2>
            <ul className="problem-list">
              {problemItems.map((item, index) => (
                <li
                  key={index}
                  className={`problem-item ${isAnimated ? 'animate-in' : ''}`}
                  style={{ transitionDelay: `${index * 100 + 400}ms` }}
                >
                  <span className="bullet">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical Divider Line */}
          <div className="divider-line">
            <div className={`line-draw ${isAnimated ? 'animate-draw' : ''}`}></div>
          </div>

          {/* Right Side: Solution */}
          <div className="solution-side">
            <h2 className="solution-headline">We fixed it</h2>
            <ul className="solution-list">
              {solutionItems.map((item, index) => (
                <li
                  key={index}
                  className={`solution-item ${isAnimated ? 'animate-in' : ''}`}
                  style={{ transitionDelay: `${index * 100 + 600}ms` }}
                >
                  <span className="bullet">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSolution

