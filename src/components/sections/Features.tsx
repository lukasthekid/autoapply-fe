import { 
  Database, 
  Sparkles, 
  FileText, 
  Search, 
  BarChart3, 
  Zap, 
  Globe,
  Code2 
} from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
}

const features: Feature[] = [
  {
    title: 'AI-Powered Generation',
    description: 'Our advanced AI creates tailored resumes and cover letters that match each job description, highlighting your most relevant experience.',
    icon: Sparkles,
    color: 'text-primary',
    bgColor: 'bg-indigo-100',
  },
  {
    title: 'Unlimited Storage',
    description: 'Upload unlimited resumes, portfolios, certificates, and work samples. Your professional profile grows with you.',
    icon: Database,
    color: 'text-secondary',
    bgColor: 'bg-teal-100',
  },
  {
    title: 'Professional Templates',
    description: 'Choose from industry-standard PDF templates. Beautiful, ATS-friendly documents that get past automated screening.',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Job Search Integration',
    description: 'Search millions of jobs from LinkedIn, Indeed, and other boards directly in the platform. Save time with one-click imports.',
    icon: Search,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    title: 'Application Tracking',
    description: 'Track every application in one centralized dashboard. Monitor response rates, schedule follow-ups, and never miss an opportunity.',
    icon: BarChart3,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'One-Click Apply',
    description: 'Generate and download personalized resumes and cover letters for dozens of jobs with a single click. Apply faster than ever.',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Multi-Language Support',
    description: 'Generate resumes and cover letters in multiple languages. Perfect for international job searches and multilingual applications.',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Smart Document Editor',
    description: 'Fine-tune your documents with our integrated editor. Full control over formatting and content when you need it.',
    icon: Code2,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
]

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to streamline your job search and maximize your success rate
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              style={{
                animation: 'fadeIn 0.6s ease-out forwards',
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
              }}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 ${feature.bgColor} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            And much more...
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            See all features in pricing plans
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Features
