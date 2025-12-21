import { useNavigate } from 'react-router-dom'
import YourProgress from '@/components/YourProgress'

const DashboardPage = () => {
  const navigate = useNavigate()

  const featureCards = [
    {
      id: 'linkedin-url',
      title: 'Import Job',
      description: 'Paste a LinkedIn job URL to get started',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      path: '/linkedin-url',
    },
    {
      id: 'job-description',
      title: 'Manual Entry',
      description: 'Paste or type a job description',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      path: '/job-description',
    },
    {
      id: 'applications',
      title: 'Tracking',
      description: 'Track your job applications',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
      path: '/applications',
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Manage your uploaded documents',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      path: '/documents',
    },
  ]

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Top section: Hero + Stats */}
      <div className="grid grid-cols-2 gap-8 mb-12 items-start max-lg:grid-cols-1">
        {/* Left side: DashboardHero CTA */}
        <div 
          className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 cursor-pointer transition-all duration-300 overflow-visible shadow-lg flex flex-col items-center text-center gap-4 min-h-[200px] hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-300 group max-md:p-6"
          onClick={() => navigate('/jobs')}
        >
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,_rgba(99,102,241,0.15)_0%,_rgba(139,92,246,0.1)_30%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 animate-pulse-soft" />

          <div className="relative flex items-center justify-center w-20 h-20 mb-0 z-10 max-md:w-16 max-md:h-16">
            {/* Icon glow effect */}
            <div className="absolute w-full h-full rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.4)_0%,_rgba(139,92,246,0.3)_40%,_transparent_70%)] animate-icon-glow blur-[20px] z-0" />
            <svg 
              className="relative w-14 h-14 text-indigo-500 z-10 drop-shadow-[0_4px_12px_rgba(99,102,241,0.3)] animate-float max-md:w-12 max-md:h-12"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 m-0 leading-tight relative z-10 max-md:text-xl">Find Your Next Opportunity</h2>
          <p className="text-[15px] text-gray-600 leading-relaxed m-0 max-w-[500px] relative z-10 max-md:text-sm">
            Search thousands of jobs and discover your perfect match.
            Apply with personalised docuements.
          </p>
          <button 
            className="inline-flex items-center gap-2 px-5 py-3 text-[15px] font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 border-none rounded-xl cursor-pointer transition-all duration-300 mt-0 relative z-10 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 active:translate-y-0 max-md:w-full max-md:justify-center" 
            onClick={(e) => { e.stopPropagation(); navigate('/jobs'); }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            Search Jobs
          </button>
        </div>

        {/* Right side: Stats widget */}
        <YourProgress />
      </div>

      {/* Bottom section: Feature cards */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-md:gap-4 max-sm:grid-cols-1">
          {featureCards.map((card) => (
            <div
              key={card.id}
              className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-900/10 hover:border-indigo-200 max-md:p-5"
              onClick={() => navigate(card.path)}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-gray-900/15" 
                style={{ background: card.gradient }}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
