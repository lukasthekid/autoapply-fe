import { useState } from 'react'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login')
  const { isScrolled } = useScrollPosition()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogin = () => {
    setAuthModalMode('login')
    setIsAuthModalOpen(true)
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>AutoApply</h1>
            </div>
            {!isAuthenticated && (
              <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                <a href="#features">Features</a>
                <a href="#templates">Templates</a>
                <a href="#pricing">Pricing</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#faq">FAQ</a>
              </nav>
            )}
            <div className="header-actions">
              {isAuthenticated ? (
                <>
                  <span className="nav-user">👤 {user?.username}</span>
                  <button 
                    className="btn-secondary btn-glow-secondary"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn-primary btn-glow"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <button
                    className="menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  )
}

export default Header

