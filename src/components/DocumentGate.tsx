import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { documentsService } from '@/services/documentsService'

interface DocumentGateProps {
  children: React.ReactNode
}

/**
 * Component that checks if user has uploaded documents
 * If not, redirects to document upload page
 */
export default function DocumentGate({ children }: DocumentGateProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)

  const checkDocumentStatus = useCallback(async () => {
    try {
      const status = await documentsService.getStatus()
      
      // If no documents and not already on onboarding or documents page, redirect
      if (!status.has_uploaded_document && 
          location.pathname !== '/onboarding' && 
          location.pathname !== '/documents') {
        navigate('/onboarding', { replace: true })
      }
    } catch (error) {
      console.error('Failed to check document status:', error)
      // On error, allow access (fail open)
    } finally {
      setIsCheckingStatus(false)
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    setIsCheckingStatus(true) // Reset loading state on navigation
    checkDocumentStatus()
  }, [location.pathname, checkDocumentStatus]) // Re-check whenever user navigates to a different page

  // Show loading state while checking
  if (isCheckingStatus) {
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
          <p>Checking status...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

