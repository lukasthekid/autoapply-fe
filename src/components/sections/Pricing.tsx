import { useState } from 'react'
import './Pricing.css'
import ScrollAnimation from './ScrollAnimation'
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
    price: '€0',
    period: '/ month',
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
    name: 'Pro',
    price: '€5',
    period: '/ month',
    description: 'For serious job seekers',
    features: [
      'Unlimited cover letters',
      'Access to all templates',
      'Search millions of jobs globally',
      'Application Tracking and Dashboard',
      'Unlimited file uploads',
    ],
    cta: 'Get Started',
    popular: true,
  },
]

const Pricing = () => {
  const { isAuthenticated } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup')

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
      <section id="pricing" className="pricing">
        <div className="container">
          <ScrollAnimation className="scroll-slide-up">
            <div className="section-header">
              <h2>Simple and Transparent Pricing</h2>
              <p>Choose the plan that works best for your job search journey</p>
            </div>
          </ScrollAnimation>
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <ScrollAnimation 
                key={index} 
                delay={index * 150}
                className="scroll-scale"
              >
                <div
                  className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
                >
                  {plan.popular && (
                    <div className="pricing-badge">Most Popular</div>
                  )}
                  <div className="pricing-header">
                    <h3>{plan.name}</h3>
                    <div className="pricing-price">
                      <span className="price-amount">{plan.price}</span>
                      <span className="price-period">{plan.period}</span>
                    </div>
                    <p className="pricing-description">{plan.description}</p>
                  </div>
                  <ul className="pricing-features">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <span className="feature-check">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`btn-primary btn-large ${plan.popular ? '' : 'btn-secondary'}`}
                    onClick={() => handlePlanSelect(plan.name)}
                  >
                    {plan.cta}
                  </button>
                </div>
              </ScrollAnimation>
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

