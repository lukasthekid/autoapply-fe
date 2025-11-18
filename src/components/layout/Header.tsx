import { useState, useEffect, useRef } from 'react'
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
  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const handleLogin = () => {
    setAuthModalMode('login')
    setIsAuthModalOpen(true)
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
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

  // Close menu when navigation link is clicked
  const handleNavClick = () => {
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
              <nav ref={navRef} className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                <a href="#features" onClick={handleNavClick}>Features</a>
                <a href="#templates" onClick={handleNavClick}>Templates</a>
                <a href="#pricing" onClick={handleNavClick}>Pricing</a>
                <a href="#testimonials" onClick={handleNavClick}>Testimonials</a>
                <a href="#faq" onClick={handleNavClick}>FAQ</a>
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
                    ref={menuButtonRef}
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

