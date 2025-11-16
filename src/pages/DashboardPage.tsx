import { useNavigate } from 'react-router-dom'
import './DashboardPage.css'

const DashboardPage = () => {
  const navigate = useNavigate()

  const features = [
    {
      id: 'job-search',
      title: 'Job Search',
      description: 'Search thousands of jobs from LinkedIn and generate tailored cover letters',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      path: '/jobs',
      badge: 'Popular',
    },
    {
      id: 'linkedin-url',
      title: 'LinkedIn Job URL',
      description: 'Paste a LinkedIn job URL and instantly generate a customized cover letter',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      path: '/linkedin-url',
      badge: 'Quick',
    },
    {
      id: 'job-description',
      title: 'Job Description',
      description: 'Paste or type a job description and let AI craft your perfect cover letter',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      path: '/job-description',
      badge: 'Flexible',
    },
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>
            Welcome Back! 👋
          </h1>
          <p>Choose how you'd like to apply for jobs today</p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="feature-card"
              onClick={() => navigate(feature.path)}
            >
              <div className="feature-badge">{feature.badge}</div>
              
              <div className="feature-icon" style={{ background: feature.gradient }}>
                {feature.icon}
              </div>

              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>

              <div className="feature-action">
                <span>Get Started</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>

              <div className="feature-glow" style={{ background: feature.gradient }}></div>
            </div>
          ))}
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h4>Track Progress</h4>
              <p>Monitor your applications</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h4>AI-Powered</h4>
              <p>Smart cover letter generation</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h4>Tailored Results</h4>
              <p>Personalized to each job</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

