import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import JobSearchPage from './pages/JobSearchPage'
import LinkedInUrlPage from './pages/LinkedInUrlPage'
import JobDescriptionPage from './pages/JobDescriptionPage'
import DocumentUploadPage from './pages/DocumentUploadPage'
import DocumentsPage from './pages/DocumentsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import DashboardLayout from './components/layout/DashboardLayout'
import DocumentGate from './components/DocumentGate'
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
            {/* Document upload page (no layout, no document gate) */}
            <Route path="/upload-documents" element={<DocumentUploadPage />} />
            
            {/* Documents management page (with layout, with gate) */}
            <Route path="/documents" element={
              <DocumentGate>
                <DashboardLayout>
                  <DocumentsPage />
                </DashboardLayout>
              </DocumentGate>
            } />
            
            {/* Applications page (with layout, with gate) */}
            <Route path="/applications" element={
              <DocumentGate>
                <DashboardLayout>
                  <ApplicationsPage />
                </DashboardLayout>
              </DocumentGate>
            } />
            
            {/* Main app routes (all require documents) */}
            <Route path="/dashboard" element={
              <DocumentGate>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </DocumentGate>
            } />
            <Route path="/jobs" element={
              <DocumentGate>
                <DashboardLayout>
                  <JobSearchPage />
                </DashboardLayout>
              </DocumentGate>
            } />
            <Route path="/linkedin-url" element={
              <DocumentGate>
                <DashboardLayout>
                  <LinkedInUrlPage />
                </DashboardLayout>
              </DocumentGate>
            } />
            <Route path="/job-description" element={
              <DocumentGate>
                <DashboardLayout>
                  <JobDescriptionPage />
                </DashboardLayout>
              </DocumentGate>
            } />
            <Route path="/settings" element={
              <DocumentGate>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </DocumentGate>
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

