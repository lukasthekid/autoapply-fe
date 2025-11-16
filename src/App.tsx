import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import JobSearchPage from './pages/JobSearchPage'
import LinkedInUrlPage from './pages/LinkedInUrlPage'
import JobDescriptionPage from './pages/JobDescriptionPage'
import DashboardLayout from './components/layout/DashboardLayout'
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

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        
        {/* Protected routes */}
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            } />
            <Route path="/jobs" element={
              <DashboardLayout>
                <JobSearchPage />
              </DashboardLayout>
            } />
            <Route path="/linkedin-url" element={
              <DashboardLayout>
                <LinkedInUrlPage />
              </DashboardLayout>
            } />
            <Route path="/job-description" element={
              <DashboardLayout>
                <JobDescriptionPage />
              </DashboardLayout>
            } />
            <Route path="/settings" element={
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            } />
            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          /* Redirect unauthenticated users to landing page */
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  )
}

export default App

