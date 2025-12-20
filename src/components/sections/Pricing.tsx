import { useState } from 'react'
import { Check, Sparkles, Zap } from 'lucide-react'
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
  color: string
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for exploring the platform',
    features: [
      '5 AI-generated documents per month',
      'Access to all templates',
      'Search millions of jobs globally',
      'Application tracking dashboard',
      'Upload up to 2 files',
      'Basic support',
    ],
    cta: 'Get Started Free',
    color: 'border-gray-200',
  },
  {
    name: 'Premium',
    price: '$5',
    period: '/month',
    description: 'For serious job seekers',
    features: [
      'Unlimited AI-generated resumes & cover letters',
      'Access to all premium templates',
      'Advanced job search with filters',
      'Full application tracking suite',
      'Unlimited file uploads',
      'Priority email support',
      'Smart document editor',
      'Multi-language support',
      'Export to multiple formats',
      'Follow-up reminders',
    ],
    cta: 'Start Premium Trial',
    popular: true,
    color: 'border-primary',
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
      <section id="pricing" className="py-24 bg-gradient-to-b from-primary/5 to-white">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Pricing</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your job search needs. Start free, upgrade anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl shadow-xl border-2 ${plan.color} hover:shadow-2xl transition-all duration-300 ${
                  plan.popular ? 'scale-105 md:scale-110' : ''
                }`}
                style={{
                  animation: 'fadeIn 0.6s ease-out forwards',
                  animationDelay: `${index * 0.2}s`,
                  opacity: 0,
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="p-8 lg:p-10">
                  {/* Plan Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelect(plan.name)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {plan.name === 'Free' && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      No credit card required
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 border border-green-200 rounded-full">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">
                <span className="font-semibold">30-day money-back guarantee</span> · Cancel anytime
              </span>
            </div>
          </div>

          {/* FAQ Note */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Questions about pricing?{' '}
              <a href="#faq" className="text-primary hover:text-primary-dark font-semibold">
                Check our FAQ
              </a>
            </p>
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
