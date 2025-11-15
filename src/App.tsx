import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import SettingsPage from './pages/SettingsPage'
import Header from './components/layout/Header'
import './styles/index.css'

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--border-color)',
            borderTopColor: 'var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show settings page for authenticated users, landing page for others
  return (
    <>
      {isAuthenticated ? (
        <>
          <Header />
          <SettingsPage />
        </>
      ) : (
        <LandingPage />
      )}
    </>
  )
}

export default App

