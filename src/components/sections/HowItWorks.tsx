import { Upload, Search, Sparkles, Send } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Your Documents',
      description: 'Upload your resume, portfolio, and any other relevant documents. Our platform securely stores everything in one place.',
      icon: Upload,
      color: 'from-primary to-purple-600',
    },
    {
      number: '02',
      title: 'Find Perfect Jobs',
      description: 'Search millions of job listings from top job boards or manually add opportunities you find. Filter by industry, location, and requirements.',
      icon: Search,
      color: 'from-purple-600 to-secondary',
    },
    {
      number: '03',
      title: 'Generate Your Documents',
      description: 'Our AI analyzes each job description and creates personalized resumes and cover letters that highlight your most relevant experience and skills.',
      icon: Sparkles,
      color: 'from-secondary to-green-600',
    },
    {
      number: '04',
      title: 'Apply & Track',
      description: 'Download your tailored documents and apply with confidence. Track all applications in one dashboard and never miss a follow-up.',
      icon: Send,
      color: 'from-green-600 to-primary',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary">How It Works</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Land Your Dream Job in 4 Simple Steps
          </h2>
          <p className="text-xl text-gray-600">
            Our streamlined process makes job applications faster and more effective
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-600 via-secondary to-green-600 transform -translate-y-1/2" 
               style={{ 
                 top: '80px',
                 left: '10%',
                 right: '10%',
                 width: '80%'
               }} 
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative"
                style={{
                  animation: 'fadeIn 0.8s ease-out forwards',
                  animationDelay: `${index * 0.2}s`,
                  opacity: 0,
                }}
              >
                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                  {/* Step Number */}
                  <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 bg-gradient-to-br ${step.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Start Your Job Search Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
