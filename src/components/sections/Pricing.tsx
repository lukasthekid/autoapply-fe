import './Pricing.css'

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
      'Job search from 6+ sources',
      'Document upload (up to 3 files)',
      'Basic application dashboard',
      'Standard support',
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
      'Job search from 6+ sources',
      'Unlimited document uploads',
      'Advanced application dashboard',
      'Priority support',
      'Export applications to CSV',
      'Application analytics',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
]

const Pricing = () => {
  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <div className="section-header">
          <h2>Simple and Transparent Pricing</h2>
          <p>Choose the plan that works best for your job search journey</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div
              key={index}
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
                onClick={() => {
                  // Handle signup/upgrade logic here
                  console.log(`Selected plan: ${plan.name}`)
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing

