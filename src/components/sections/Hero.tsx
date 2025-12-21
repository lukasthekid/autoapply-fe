import { useState } from 'react'
import { ArrowRight, CheckCircle2, Sparkles, Zap, TrendingUp } from 'lucide-react'
import AuthModal from '@/components/AuthModal'

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup')

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-teal-50/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-8 py-32 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left Side: Text Content */}
            <div className="space-y-10 max-w-2xl mx-auto lg:mx-0">
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-sm animate-fade-in"
                style={{ animationDelay: '0.1s', opacity: 0 }}
              >
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-gray-700">AI-Powered Job Application Platform</span>
              </div>

              {/* Headline */}
              <h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-in"
                style={{ animationDelay: '0.2s', opacity: 0 }}
              >
                <span className="text-gray-900">Get Your</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
                  Dream Job
                </span>
                <br />
                <span className="text-gray-900">10x Faster</span>
              </h1>

              {/* Subtitle */}
              <p 
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed animate-fade-in"
                style={{ animationDelay: '0.3s', opacity: 0 }}
              >
                AI-generated resumes and cover letters tailored to every job description. Apply to hundreds of positions in hours, not weeks.
              </p>

              {/* CTA Buttons */}
              <div 
                className="flex flex-col sm:flex-row gap-4 animate-fade-in"
                style={{ animationDelay: '0.4s', opacity: 0 }}
              >
                <button
                  onClick={() => {
                    setAuthModalMode('signup')
                    setIsAuthModalOpen(true)
                  }}
                  className="group px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-primary/50 shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust Indicators */}
              <div 
                className="flex flex-wrap items-center gap-6 pt-2 animate-fade-in"
                style={{ animationDelay: '0.5s', opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-600">Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right Side: Dashboard Preview */}
            <div 
              className="relative animate-fade-in" 
              style={{ animationDelay: '0.3s', opacity: 0 }}
            >
              {/* Decorative background blurs */}
              <div className="absolute -top-12 -right-12 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              {/* Main container */}
              <div className="relative z-10">
                {/* Browser window mockup */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]">
                  {/* Browser chrome */}
                  <div className="bg-gradient-to-b from-gray-100 to-gray-50 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-gray-600 font-medium max-w-xs flex items-center gap-2 shadow-sm border border-gray-200">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="hidden sm:inline">app.resumr.com/dashboard</span>
                        <span className="sm:hidden">resumr.com</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard image */}
                  <div className="relative bg-gray-50">
                    <img
                      src="/dashboard-overview.webp"
                      alt="Resumr dashboard showing job tracking, interviews, and application analytics"
                      className="w-full h-auto select-none"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                </div>
                
                {/* Stats grid below the mockup */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 10x Faster */}
                  <div 
                    className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: '0.6s', opacity: 0 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl mb-3">
                        <Zap className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                        10x
                      </div>
                      <div className="text-xs font-semibold text-gray-600">Faster Applications</div>
                    </div>
                  </div>
                  
                  {/* 98% Success */}
                  <div 
                    className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: '0.7s', opacity: 0 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-3">
                        <CheckCircle2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                        98%
                      </div>
                      <div className="text-xs font-semibold text-gray-600">Success Rate</div>
                    </div>
                  </div>
                  
                  {/* 3x Interviews */}
                  <div 
                    className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: '0.8s', opacity: 0 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl mb-3">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                        3x
                      </div>
                      <div className="text-xs font-semibold text-gray-600">More Interviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

export default Hero
