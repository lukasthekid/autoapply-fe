import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'

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

  const handleSignup = () => {
    setAuthModalMode('signup')
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold text-gray-900">Resumr</span>
            </a>

            {/* Desktop Navigation */}
            {!isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-8">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#faq"
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  FAQ
                </a>
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700 font-medium hidden sm:block">
                    👤 {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="hidden sm:block px-4 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignup}
                    className="hidden sm:block px-6 py-2.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                  </button>

                  {/* Mobile Menu Button */}
                  <button
                    ref={menuButtonRef}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
                    aria-label="Toggle menu"
                  >
                    {isMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {!isAuthenticated && isMenuOpen && (
          <nav
            ref={navRef}
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              <a
                href="#features"
                onClick={handleNavClick}
                className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={handleNavClick}
                className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={handleNavClick}
                className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                onClick={handleNavClick}
                className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                onClick={handleNavClick}
                className="block py-2 text-gray-700 hover:text-primary font-medium transition-colors"
              >
                FAQ
              </a>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2 text-gray-700 hover:text-primary font-medium transition-colors text-left"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="w-full px-6 py-2.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </div>
          </nav>
        )}
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
