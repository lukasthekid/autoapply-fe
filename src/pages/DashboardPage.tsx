import { useNavigate } from 'react-router-dom'
import YourProgress from '@/components/YourProgress'
import './DashboardPage.css'

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
    <div className="dashboard-page">
      {/* Top section: Hero + Stats */}
      <div className="dashboard-hero-section">
        {/* Left side: DashboardHero CTA */}
        <div 
          className="dashboard-hero-cta"
          onClick={() => navigate('/jobs')}
        >
          <div className="dashboard-hero-cta-icon-wrapper">
            <div className="dashboard-hero-cta-icon-glow"></div>
            <svg 
              className="dashboard-hero-cta-icon"
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
          <h2 className="dashboard-hero-cta-title">Find Your Next Opportunity</h2>
          <p className="dashboard-hero-cta-description">
            Search thousands of jobs and discover your perfect match.
            Apply with AI-powered cover letters.
          </p>
          <button className="btn-dashboard-hero-cta" onClick={(e) => { e.stopPropagation(); navigate('/jobs'); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            Search Jobs
          </button>
        </div>

        {/* Right side: Stats widget */}
        <YourProgress className="stats-widget" />
      </div>

      {/* Bottom section: Feature cards */}
      <div className="dashboard-features">
        <h2 className="dashboard-features-title">Quick Actions</h2>
        <div className="dashboard-features-grid">
          {featureCards.map((card) => (
            <div
              key={card.id}
              className="dashboard-feature-card"
              onClick={() => navigate(card.path)}
            >
              <div className="dashboard-feature-icon" style={{ background: card.gradient }}>
                {card.icon}
              </div>
              <h3 className="dashboard-feature-title">{card.title}</h3>
              <p className="dashboard-feature-description">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
