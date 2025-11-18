import { ReactNode, useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './DashboardLayout.css'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        navRef.current &&
        menuButtonRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // Close menu when navigation
  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <Link to="/dashboard" className="logo">
              <h1>AutoApply</h1>
            </Link>
            
            <nav ref={navRef} className={`dashboard-nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                🏠 Home
              </Link>
              <Link 
                to="/jobs" 
                className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                🔍 Job Search
              </Link>
              <Link 
                to="/linkedin-url" 
                className={`nav-link ${isActive('/linkedin-url') ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                🔗 LinkedIn URL
              </Link>
              <Link 
                to="/job-description" 
                className={`nav-link ${isActive('/job-description') ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                📝 Description
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
              <button
                ref={menuButtonRef}
                className="menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
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

