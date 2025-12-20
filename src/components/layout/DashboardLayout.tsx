import { ReactNode, useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Slim header */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm h-[60px]">
        <div className="max-w-full h-full mx-auto px-8 flex items-center justify-between">
          <Link to="/dashboard" className="no-underline flex-shrink-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent m-0">
              Resumr
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {getUserInitials()}
            </div>
            <button
              ref={menuButtonRef}
              className="hidden max-md:flex flex-col gap-1 bg-transparent border-none cursor-pointer p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="w-[22px] h-0.5 bg-gray-900 transition-all duration-300 rounded-sm"></span>
              <span className="w-[22px] h-0.5 bg-gray-900 transition-all duration-300 rounded-sm"></span>
              <span className="w-[22px] h-0.5 bg-gray-900 transition-all duration-300 rounded-sm"></span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex mt-[60px] min-h-[calc(100vh-60px)]">
        {/* Mobile overlay */}
        {isMenuOpen && (
          <div 
            className="fixed top-[60px] left-0 right-0 bottom-0 bg-black/50 z-[99] animate-fade-in md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        
        {/* Left sidebar navigation */}
        <aside 
          className={`
            fixed left-0 top-[60px] bottom-0 z-[100] 
            bg-white/95 backdrop-blur-md border-r border-gray-200 
            overflow-y-auto overflow-x-hidden
            transition-all duration-300
            ${isSidebarExpanded ? 'w-60' : 'w-[70px]'}
            ${isMenuOpen ? 'translate-x-0 w-[260px] shadow-2xl' : 'max-md:-translate-x-full'}
            md:translate-x-0
          `}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
        >
          <nav 
            ref={navRef} 
            className="py-6 flex flex-col gap-1 h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Link 
              to="/dashboard" 
              className={`
                flex items-center gap-3 px-5 py-3 no-underline font-medium text-[15px] 
                transition-all duration-200 border-l-[3px] whitespace-nowrap relative
                ${isActive('/dashboard') 
                  ? 'text-primary bg-indigo-50 border-primary font-semibold' 
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-indigo-50/50 hover:border-indigo-300'
                }
              `}
              onClick={handleNavClick}
            >
              <svg className="w-5 h-5 flex-shrink-0 min-w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className={`transition-opacity duration-200 ${isSidebarExpanded || isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
                Dashboard
              </span>
            </Link>
            <Link 
              to="/applications" 
              className={`
                flex items-center gap-3 px-5 py-3 no-underline font-medium text-[15px] 
                transition-all duration-200 border-l-[3px] whitespace-nowrap relative
                ${isActive('/applications') 
                  ? 'text-primary bg-indigo-50 border-primary font-semibold' 
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-indigo-50/50 hover:border-indigo-300'
                }
              `}
              onClick={handleNavClick}
            >
              <svg className="w-5 h-5 flex-shrink-0 min-w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className={`transition-opacity duration-200 ${isSidebarExpanded || isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
                Applications
              </span>
            </Link>
            <Link 
              to="/documents" 
              className={`
                flex items-center gap-3 px-5 py-3 no-underline font-medium text-[15px] 
                transition-all duration-200 border-l-[3px] whitespace-nowrap relative
                ${isActive('/documents') 
                  ? 'text-primary bg-indigo-50 border-primary font-semibold' 
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-indigo-50/50 hover:border-indigo-300'
                }
              `}
              onClick={handleNavClick}
            >
              <svg className="w-5 h-5 flex-shrink-0 min-w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span className={`transition-opacity duration-200 ${isSidebarExpanded || isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
                Documents
              </span>
            </Link>
            <Link 
              to="/settings" 
              className={`
                flex items-center gap-3 px-5 py-3 no-underline font-medium text-[15px] 
                transition-all duration-200 border-l-[3px] whitespace-nowrap relative
                ${isActive('/settings') 
                  ? 'text-primary bg-indigo-50 border-primary font-semibold' 
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-indigo-50/50 hover:border-indigo-300'
                }
              `}
              onClick={handleNavClick}
            >
              <svg className="w-5 h-5 flex-shrink-0 min-w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
              </svg>
              <span className={`transition-opacity duration-200 ${isSidebarExpanded || isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
                Settings
              </span>
            </Link>
            <button
              className="flex items-center gap-3 px-5 py-3 font-medium text-[15px] transition-all duration-200 border-l-[3px] whitespace-nowrap text-red-600 border-transparent hover:text-red-700 hover:bg-red-50 hover:border-red-600 bg-transparent border-none cursor-pointer w-full text-left mt-auto border-t border-gray-200 pt-4 mb-4"
              onClick={handleLogout}
            >
              <svg className="w-5 h-5 flex-shrink-0 min-w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span className={`transition-opacity duration-200 ${isSidebarExpanded || isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
                Logout
              </span>
            </button>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 ml-[70px] p-8 min-h-[calc(100vh-60px)] w-[calc(100%-70px)] transition-all duration-300 max-md:ml-0 max-md:w-full max-md:p-6 max-sm:p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout