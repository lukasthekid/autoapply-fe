import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './DashboardLayout.css'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <Link to="/dashboard" className="logo">
              <h1>AutoApply</h1>
            </Link>
            
            <nav className="dashboard-nav">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                🏠 Home
              </Link>
              <Link 
                to="/jobs" 
                className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}
              >
                🔍 Job Search
              </Link>
              <Link 
                to="/linkedin-url" 
                className={`nav-link ${isActive('/linkedin-url') ? 'active' : ''}`}
              >
                🔗 LinkedIn URL
              </Link>
              <Link 
                to="/job-description" 
                className={`nav-link ${isActive('/job-description') ? 'active' : ''}`}
              >
                📝 Description
              </Link>
              <Link 
                to="/settings" 
                className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
              >
                ⚙️ Settings
              </Link>
            </nav>

            <div className="header-actions">
              <span className="user-info">👤 {user?.username}</span>
              <button 
                className="btn-secondary btn-glow-secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout

