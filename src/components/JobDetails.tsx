import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { JobListing } from '@/types/api'
import GenerateDocumentModal from './GenerateDocumentModal'
import { applicationsService } from '@/services/applicationsService'
import { useAuth } from '@/contexts/AuthContext'
import './JobDetails.css'

interface JobDetailsProps {
  job: JobListing
  isLoadingJobDetails?: boolean
  jobDetailError?: string | null
  onStartOver?: () => void
  showStartOverButton?: boolean
  // Optional: Pass search state for restoration when navigating back
  searchState?: {
    jobs?: any[]
    searchParams?: any
    hasSearched?: boolean
    totalResults?: number
  }
}

const JobDetails = ({
  job,
  isLoadingJobDetails = false,
  jobDetailError = null,
  onStartOver,
  showStartOverButton = false,
  searchState,
}: JobDetailsProps) => {
  const navigate = useNavigate()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const [showViewMore, setShowViewMore] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const [hasApplied, setHasApplied] = useState<boolean | null>(null)
  const [isCheckingApplication, setIsCheckingApplication] = useState(false)
  const [isAddingApplication, setIsAddingApplication] = useState(false)
  const [applicationError, setApplicationError] = useState<string | null>(null)

  // Format employment type and experience level for display
  const formatText = (text: string | null | undefined) => {
    if (!text) return null
    return text.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // Check if description is long enough to need "View more"
  useEffect(() => {
    setIsDescriptionExpanded(false) // Reset when job changes
    if (descriptionRef.current && job.description) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (descriptionRef.current) {
          const height = descriptionRef.current.scrollHeight
          setShowViewMore(height > 600)
        }
      }, 0)
    }
  }, [job.job_id, job.description])

  // Check if user has already applied to this job
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!isAuthenticated) {
        setHasApplied(null)
        return
      }

      setIsCheckingApplication(true)
      setApplicationError(null)
      try {
        const response = await applicationsService.checkApplication({
          job_id: job.job_id,
          job_url: job.linkedin_url,
          job_title: job.title,
          company_name: job.company_name,
        })
        setHasApplied(response.has_applied)
      } catch (error: any) {
        console.error('Error checking application status:', error)
        // Don't show error to user, just assume not applied
        setHasApplied(false)
      } finally {
        setIsCheckingApplication(false)
      }
    }

    checkApplicationStatus()
  }, [isAuthenticated, job.job_id, job.linkedin_url, job.title, job.company_name])

  const handleGenerateClick = () => {
    setIsModalOpen(true)
  }

  const handleSelectCoverLetter = () => {
    // Navigate to cover letter page with job details and return path
    const returnPath = window.location.pathname // Current page path
    navigate('/cover-letter', {
      state: {
        jobId: job.job_id,
        companyName: job.company_name,
        jobTitle: job.title,
        jobLocation: job.location,
        jobUrl: job.linkedin_url,
        returnPath: returnPath,
        job: job, // Pass full job object for restoration
        searchState: searchState, // Pass search state for restoration
      }
    })
  }

  const handleSelectResume = () => {
    // Navigate to resume page with job details and return path
    const returnPath = window.location.pathname // Current page path
    navigate('/resume', {
      state: {
        jobId: job.job_id,
        companyName: job.company_name,
        jobTitle: job.title,
        jobLocation: job.location,
        jobUrl: job.linkedin_url,
        jobDescription: job.description || '', // Pass job description for resume generation
        returnPath: returnPath,
        job: job, // Pass full job object for restoration
        searchState: searchState, // Pass search state for restoration
      }
    })
  }

  const handleApplyClick = async () => {
    const goToJobPage = () => {
      if (job.linkedin_url) {
        window.open(job.linkedin_url, '_blank', 'noopener,noreferrer')
      }
    }

    // Always allow navigation for unauthenticated users
    if (!isAuthenticated) {
      goToJobPage()
      return
    }

    // If we've already added it, just navigate
    if (hasApplied) {
      goToJobPage()
      return
    }

    setIsAddingApplication(true)
    setApplicationError(null)
    try {
      await applicationsService.createApplication({
        job_id: job.job_id || null,
        job_title: job.title,
        company_name: job.company_name,
        job_location: job.location || null,
        job_url: job.linkedin_url || null,
        notes: null,
      })
      setHasApplied(true)
    } catch (error: any) {
      console.error('Error adding application:', error)
      setApplicationError(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to add application. Please try again.'
      )
    } finally {
      setIsAddingApplication(false)
      goToJobPage()
    }
  }

  return (
    <div className="job-detail-panel">
      <div className="job-details-content">
        {jobDetailError && (
          <div className="job-detail-error">
            ⚠️ {jobDetailError}
          </div>
        )}
        
        {applicationError && (
          <div className="job-detail-error" style={{ marginTop: '1rem' }}>
            ⚠️ {applicationError}
          </div>
        )}
        
        {/* Compact Summary Block */}
        <div className="job-summary-block">
          <div className="job-summary-header">
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2>{job.title}</h2>
              <p className="company-name-large" style={{ marginTop: '0.25rem', marginBottom: '0.75rem' }}>
                {job.company_name}
              </p>
              
              {/* Key tags and meta in one row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>📍 {job.location}</span>
                {job.employment_type && (
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '0.75rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-primary)',
                    fontWeight: 500
                  }}>
                    {formatText(job.employment_type)}
                  </span>
                )}
                {job.experience_level && (
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '0.75rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-primary)',
                    fontWeight: 500
                  }}>
                    {formatText(job.experience_level)}
                  </span>
                )}
                {job.applicants_count && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    👥 {job.applicants_count} applicants
                  </span>
                )}
              </div>
            </div>

            {/* Action Bar at Top - aligned right */}
            <div className="job-summary-actions">
              {isAuthenticated && hasApplied === true && (
                <span
                  className="btn-secondary"
                  style={{ 
                    padding: '0.6rem 1.25rem', 
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    opacity: 0.7,
                    cursor: 'default',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-primary)'
                  }}
                  title="You have already added this job"
                >
                  ✓ Added
                </span>
              )}
              <button
                onClick={handleApplyClick}
                disabled={isAddingApplication || isCheckingApplication}
                className="btn-secondary"
                style={{ 
                  padding: '0.6rem 1.25rem', 
                  fontSize: '0.9rem', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  cursor: (isAddingApplication || isCheckingApplication) ? 'not-allowed' : 'pointer',
                  opacity: (isAddingApplication || isCheckingApplication) ? 0.7 : 1
                }}
              >
                {isAddingApplication ? 'Applying...' : 'Apply'}
              </button>
              <button 
                className="sparkles-icon-button"
                onClick={handleGenerateClick}
                title="Generate cover letter or resume"
              >
                <svg 
                  viewBox="0 0 56 56" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="sparkles-icon"
                >
                  <defs>
                    <linearGradient id={`sparkles-gradient-${job.job_id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="50%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 26.6875 12.6602 C 26.9687 12.6602 27.1094 12.4961 27.1797 12.2383 C 27.9062 8.3242 27.8594 8.2305 31.9375 7.4570 C 32.2187 7.4102 32.3828 7.2461 32.3828 6.9648 C 32.3828 6.6836 32.2187 6.5195 31.9375 6.4726 C 27.8828 5.6524 28.0000 5.5586 27.1797 1.6914 C 27.1094 1.4336 26.9687 1.2695 26.6875 1.2695 C 26.4062 1.2695 26.2656 1.4336 26.1953 1.6914 C 25.3750 5.5586 25.5156 5.6524 21.4375 6.4726 C 21.1797 6.5195 20.9922 6.6836 20.9922 6.9648 C 20.9922 7.2461 21.1797 7.4102 21.4375 7.4570 C 25.5156 8.2774 25.4687 8.3242 26.1953 12.2383 C 26.2656 12.4961 26.4062 12.6602 26.6875 12.6602 Z M 15.3438 28.7852 C 15.7891 28.7852 16.0938 28.5039 16.1406 28.0821 C 16.9844 21.8242 17.1953 21.8242 23.6641 20.5821 C 24.0860 20.5117 24.3906 20.2305 24.3906 19.7852 C 24.3906 19.3633 24.0860 19.0586 23.6641 18.9883 C 17.1953 18.0977 16.9609 17.8867 16.1406 11.5117 C 16.0938 11.0899 15.7891 10.7852 15.3438 10.7852 C 14.9219 10.7852 14.6172 11.0899 14.5703 11.5352 C 13.7969 17.8164 13.4687 17.7930 7.0469 18.9883 C 6.6250 19.0821 6.3203 19.3633 6.3203 19.7852 C 6.3203 20.2539 6.6250 20.5117 7.1406 20.5821 C 13.5156 21.6133 13.7969 21.7774 14.5703 28.0352 C 14.6172 28.5039 14.9219 28.7852 15.3438 28.7852 Z M 31.2344 54.7305 C 31.8438 54.7305 32.2891 54.2852 32.4062 53.6524 C 34.0703 40.8086 35.8750 38.8633 48.5781 37.4570 C 49.2344 37.3867 49.6797 36.8945 49.6797 36.2852 C 49.6797 35.6758 49.2344 35.2070 48.5781 35.1133 C 35.8750 33.7070 34.0703 31.7617 32.4062 18.9180 C 32.2891 18.2852 31.8438 17.8633 31.2344 17.8633 C 30.6250 17.8633 30.1797 18.2852 30.0860 18.9180 C 28.4219 31.7617 26.5938 33.7070 13.9140 35.1133 C 13.2344 35.2070 12.7891 35.6758 12.7891 36.2852 C 12.7891 36.8945 13.2344 37.3867 13.9140 37.4570 C 26.5703 39.1211 28.3281 40.8321 30.0860 53.6524 C 30.1797 54.2852 30.6250 54.7305 31.2344 54.7305 Z" 
                    fill={`url(#sparkles-gradient-${job.job_id})`}
                  />
                </svg>
              </button>
              {showStartOverButton && onStartOver && (
                <button 
                  className="btn-secondary"
                  onClick={onStartOver}
                  style={{ 
                    padding: '0.6rem 1.25rem', 
                    fontSize: '0.9rem'
                  }}
                >
                  Try another URL
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoadingJobDetails && (
          <div className="loading-indicator" style={{ padding: '2rem' }}>
            <div className="loading-spinner-small"></div>
            <p>Loading full job description...</p>
          </div>
        )}

        {job.description && (
          <div className="job-description-full">
            <h3>Job Description</h3>
            <div 
              ref={descriptionRef}
              className={`description-content ${!isDescriptionExpanded && showViewMore ? 'description-collapsed' : ''}`}
              dangerouslySetInnerHTML={{ 
                __html: (() => {
                  if (!job.description) return ''

                  // Escape any HTML just to be safe
                  const escapeHtml = (str: string) =>
                    str
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')

                  const normalized = job.description.replace(/\r\n/g, '\n')

                  // Treat the description as plain text:
                  // - Split into paragraphs on double (or more) newlines
                  // - Keep single line breaks inside a paragraph as <br /> so original
                  //   line structure is preserved, but paragraphs are clearly separated.
                  const paragraphs = normalized
                    .split(/\n{2,}/)
                    .map(block => {
                      const lines = block.split('\n')
                      const escapedLines = lines
                        .map(l => escapeHtml(l.trim()))
                        .filter(Boolean)
                      return escapedLines.join('<br /><br />')
                    })
                    .filter(Boolean)

                  return paragraphs.map(p => `<p>${p}</p>`).join('')
                })()
              }}
            />
            {showViewMore && (
              <button
                className={`view-more-button ${isDescriptionExpanded ? 'expanded' : ''}`}
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <span>{isDescriptionExpanded ? 'Show less' : 'View full description'}</span>
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
      <GenerateDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCoverLetter={handleSelectCoverLetter}
        onSelectResume={handleSelectResume}
      />
    </div>
  )
}

export default JobDetails

