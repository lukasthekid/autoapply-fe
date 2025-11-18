import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './DashboardPage.css'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const getInitials = () => {
    if (!user) return '?'
    const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || ''
    const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || ''
    return firstInitial && lastInitial 
      ? `${firstInitial}${lastInitial}`
      : user.username?.charAt(0)?.toUpperCase() || '?'
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

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
        <div className="dashboard-layout">
          {/* Left Sidebar Toolbar */}
          <div className="dashboard-sidebar">
            <div className="sidebar-header">
              <div className="profile-bubble" title={user?.username}>
                {getInitials()}
              </div>
              <div className="sidebar-divider"></div>
            </div>
            
            <div className="sidebar-links">
              <button 
                className="sidebar-link"
                onClick={() => navigate('/documents')}
                title="Documents"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span className="sidebar-link-label">Documents</span>
              </button>

              <button 
                className="sidebar-link"
                onClick={() => navigate('/settings')}
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                </svg>
                <span className="sidebar-link-label">Settings</span>
              </button>
            </div>

            <div className="sidebar-footer">
              <button 
                className="sidebar-link"
                onClick={handleLogout}
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span className="sidebar-link-label">Logout</span>
              </button>
              
              <div className="sidebar-divider"></div>
              
              <div className="sidebar-tip">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <span className="sidebar-tip-text">Keep documents updated</span>
              </div>
            </div>
          </div>

          <div className="dashboard-main">
            <div className="dashboard-header">
              <h1>Welcome back, {user?.first_name || user?.username || 'there'}! 👋</h1>
              <p>Choose your workflow to create the perfect cover letter</p>
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

            <div className="features-footer">
              <div className="footer-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <span>AI-Powered Generation</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🎯</div>
                  <span>Tailored to Each Job</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🚀</div>
                  <span>Generate in Seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <button 
          className="mobile-nav-item"
          onClick={() => navigate('/documents')}
          title="Documents"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Documents</span>
        </button>

        <button 
          className="mobile-nav-item"
          onClick={() => navigate('/settings')}
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
          </svg>
          <span>Settings</span>
        </button>

        <button 
          className="mobile-nav-item"
          onClick={handleLogout}
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default DashboardPage

