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

            {/* Right Side: Visual Element with Placeholder */}
            <div 
              className="relative animate-fade-in" 
              style={{ animationDelay: '0.3s', opacity: 0 }}
            >
              {/* Decorative background blurs */}
              <div className="absolute -top-12 -right-12 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              {/* Main Placeholder Container */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white backdrop-blur-sm">
                {/* Styled Placeholder */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 p-8 flex items-center justify-center">
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px'
                    }}
                  />
                  
                  {/* Decorative elements */}
                  <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-300/20 rounded-2xl blur-xl" />
                  <div className="absolute bottom-8 right-8 w-40 h-40 bg-gradient-to-tl from-secondary/20 to-teal-300/20 rounded-2xl blur-xl" />
                  
                  {/* Placeholder content */}
                  <div className="relative z-10 text-center space-y-4 max-w-md">
                    <div className="flex items-center justify-center">
                      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
                        <Sparkles className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Dashboard Preview</h3>
                    <p className="text-gray-600">
                      Track applications, generate tailored resumes, and land interviews faster
                    </p>
                    
                    {/* Mock UI elements */}
                    <div className="pt-4 space-y-3">
                      <div className="h-3 bg-gradient-to-r from-primary/30 to-purple-300/30 rounded-full w-3/4 mx-auto" />
                      <div className="h-3 bg-gradient-to-r from-purple-300/30 to-secondary/30 rounded-full w-1/2 mx-auto" />
                      <div className="h-3 bg-gradient-to-r from-secondary/30 to-teal-300/30 rounded-full w-2/3 mx-auto" />
                    </div>
                  </div>
                </div>
                
                {/* Floating stat cards - repositioned */}
                <div 
                  className="absolute -left-6 top-[20%] bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 animate-fade-in hover:scale-110 transition-transform duration-300" 
                  style={{ animationDelay: '0.8s', opacity: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">10x</div>
                      <div className="text-xs font-medium text-gray-600">Faster</div>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute -right-6 top-[55%] bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 animate-fade-in hover:scale-110 transition-transform duration-300" 
                  style={{ animationDelay: '1s', opacity: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">98%</div>
                      <div className="text-xs font-medium text-gray-600">Success</div>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute -left-6 bottom-[15%] bg-white rounded-2xl shadow-2xl p-5 border border-gray-100 animate-fade-in hover:scale-110 transition-transform duration-300" 
                  style={{ animationDelay: '1.2s', opacity: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">3x</div>
                      <div className="text-xs font-medium text-gray-600">Interviews</div>
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
