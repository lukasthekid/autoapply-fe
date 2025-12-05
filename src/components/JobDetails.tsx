import { useState, useRef, useEffect } from 'react'
import type { JobListing } from '@/types/api'
import './JobDetails.css'

interface JobDetailsProps {
  job: JobListing
  isLoadingJobDetails?: boolean
  jobDetailError?: string | null
  onGenerateCoverLetter: () => void
  onStartOver?: () => void
  showStartOverButton?: boolean
}

const JobDetails = ({
  job,
  isLoadingJobDetails = false,
  jobDetailError = null,
  onGenerateCoverLetter,
  onStartOver,
  showStartOverButton = false,
}: JobDetailsProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const [showViewMore, setShowViewMore] = useState(false)

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

  return (
    <div className="job-detail-panel">
      <div className="job-details-content">
        {jobDetailError && (
          <div className="job-detail-error">
            ⚠️ {jobDetailError}
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
              <a
                href={job.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ 
                  padding: '0.6rem 1.25rem', 
                  fontSize: '0.9rem', 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Apply
              </a>
              <button 
                className="btn-primary"
                onClick={onGenerateCoverLetter}
                style={{ 
                  padding: '0.6rem 1.25rem', 
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                Generate cover letter
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
    </div>
  )
}

export default JobDetails

