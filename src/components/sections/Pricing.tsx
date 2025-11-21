import { useState, useEffect } from 'react'
import './Pricing.css'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: 'Free',
    period: '',
    description: 'Perfect for trying out our platform',
    features: [
      '5 cover letters per month',
      'Access to all templates',
      'Search millions of jobs globally',
      'Application Tracking and Dashboard',
      'Upload up to 2 files',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Premium',
    price: '$5',
    period: '/month',
    description: 'For serious job seekers',
    features: [
      'Unlimited cover letters',
      'Access to all templates',
      'Search millions of jobs globally',
      'Application Tracking and Dashboard',
      'Unlimited file uploads',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: true,
  },
]

const Pricing = () => {
  const { isAuthenticated } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup')
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

  const handlePlanSelect = (planName: string) => {
    if (isAuthenticated) {
      // Handle plan upgrade when authenticated
      console.log(`Selected plan: ${planName}`)
    } else {
      // Open signup modal
      setAuthModalMode('signup')
      setIsAuthModalOpen(true)
    }
  }

  return (
    <>
      <section id="pricing" className="pricing" ref={elementRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <div className="section-header">
            <h2>Simple and Transparent Pricing</h2>
            <p>Choose the plan that works best for your job search journey</p>
          </div>
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''} ${isAnimated ? 'animate-in' : ''}`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {plan.popular && (
                  <div 
                    className={`pricing-badge ${isAnimated ? 'badge-bounce' : ''}`}
                    style={{
                      animationDelay: `${index * 50 + 700}ms`,
                    }}
                  >
                    Most Popular
                  </div>
                )}
                  <div className="pricing-header">
                    <h3 className={`pricing-plan-name ${plan.popular ? 'pricing-plan-premium' : ''}`}>
                      {plan.name}
                    </h3>
                    <div className="pricing-price">
                      <span className="price-amount">{plan.price}</span>
                      {plan.period && <span className="price-period">{plan.period}</span>}
                    </div>
                    <p className="pricing-description">{plan.description}</p>
                  </div>
                  <ul className="pricing-features">
                    {plan.features.map((feature, featureIndex) => (
                      <li 
                        key={featureIndex}
                        className={isAnimated ? 'feature-item-animate' : ''}
                        style={{
                          transitionDelay: `${index * 50 + 100 + featureIndex * 50}ms`,
                        }}
                      >
                        <span className="feature-check">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`pricing-cta ${plan.popular ? 'pricing-cta-premium' : 'pricing-cta-free'}`}
                    onClick={() => handlePlanSelect(plan.name)}
                  >
                    {plan.cta}
                  </button>
                </div>
            ))}
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

export default Pricing

