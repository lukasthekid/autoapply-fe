import { useEffect, useState } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import './Testimonials.css'

interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
  image: string
  logo?: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Tech Corp',
    quote: 'Landed an offer from my dream company in 2 weeks. Applied to 150+ jobs with AutoApply.',
    image: '/Sarah Chen.png',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager',
    company: 'StartupXYZ',
    quote: 'The AI-generated cover letters are incredibly personalized. I landed 3 interviews in my first week!',
    image: '/Michael Rodriguez.png',
  },
  {
    name: 'Emily Johnson',
    role: 'Data Scientist',
    company: 'DataFlow Inc',
    quote: 'Being able to search jobs from multiple sources and generate tailored cover letters in minutes is a game-changer.',
    image: '/Emily Johnson.png',
  },
  {
    name: 'David Kim',
    role: 'Frontend Developer',
    company: 'WebStudio',
    quote: 'I love the professional templates! Each cover letter looks polished and professional. The one-click application feature makes the whole process seamless.',
    image: '/David Kim.png',
  },
  {
    name: 'Lisa Anderson',
    role: 'Marketing Manager',
    company: 'BrandCo',
    quote: 'As someone switching careers, AutoApply helped me highlight relevant experience from my past roles. The AI understands context and creates compelling narratives.',
    image: '/Lisa Anderson.png',
  },
  {
    name: 'James Wilson',
    role: 'DevOps Engineer',
    company: 'CloudTech',
    quote: 'The document vectorization feature is brilliant. I uploaded my thesis and reference letters, and the system incorporated insights I never would have thought to include.',
    image: '/James Wilson.png',
  },
]

const Testimonials = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.4, // 40% into viewport
    rootMargin: '0px',
    triggerOnce: true,
  })
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

  return (
    <section id="testimonials" className="testimonials" ref={elementRef as React.RefObject<HTMLElement>}>
      <div className="container">
        <div className="testimonials-header">
          <h2 className="testimonials-headline">Join 1,000+ job seekers who landed their dream roles</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card ${isAnimated ? 'animate-in' : ''}`}
              style={{
                transitionDelay: isMobile ? `${index * 50}ms` : `${index * 100}ms`,
              }}
            >
              <div className="testimonial-stars">
                {[...Array(5)].map((_, starIndex) => (
                  <span
                    key={starIndex}
                    className={`star ${isAnimated ? 'star-animate-in' : ''}`}
                    style={{
                      animationDelay: isMobile 
                        ? `${index * 50 + starIndex * 50}ms` 
                        : `${index * 100 + starIndex * 100}ms`,
                    }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <div 
                className={`testimonial-quote ${isAnimated ? 'quote-animate-in' : ''}`}
                style={{
                  transitionDelay: isMobile 
                    ? `${index * 50 + 100}ms` 
                    : `${index * 100 + 200}ms`,
                }}
              >
                <p>"{testimonial.quote}"</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-title">{testimonial.role} @ {testimonial.company}</div>
                </div>
                {testimonial.logo && (
                  <div className="testimonial-logo">
                    <img src={testimonial.logo} alt={testimonial.company} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

