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
  return (
    <div className="job-detail-panel">
      <div className="job-details-content">
        {jobDetailError && (
          <div className="job-detail-error">
            ⚠️ {jobDetailError}
          </div>
        )}
        
        <div className="job-header-full">
          <div className="job-header-left">
            {job.company_logo_url && (
              <img
                src={job.company_logo_url}
                alt={`${job.company_name} logo`}
                className="company-logo-large"
              />
            )}
            <div>
              <h2>{job.title}</h2>
              <p className="company-name-large">{job.company_name}</p>
            </div>
          </div>
          
          <div className="job-header-actions">
            <a
              href={job.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Apply
            </a>
            <button 
              className="btn-primary btn-glow btn-multiline"
              onClick={onGenerateCoverLetter}
            >
              <span>Generate</span>
              <span>Cover Letter</span>
            </button>
            {showStartOverButton && onStartOver && (
              <button 
                className="btn-secondary"
                onClick={onStartOver}
              >
                Try Another URL
              </button>
            )}
          </div>
        </div>

        <div className="job-info-grid">
          <div className="info-item">
            <span className="info-label">📍 Location</span>
            <span className="info-value">{job.location}</span>
          </div>
          {job.employment_type && (
            <div className="info-item">
              <span className="info-label">💼 Employment Type</span>
              <span className="info-value">{job.employment_type}</span>
            </div>
          )}
          {job.experience_level && (
            <div className="info-item">
              <span className="info-label">📊 Experience Level</span>
              <span className="info-value">{job.experience_level}</span>
            </div>
          )}
          {job.applicants_count && (
            <div className="info-item">
              <span className="info-label">👥 Applicants</span>
              <span className="info-value">{job.applicants_count}</span>
            </div>
          )}
          {job.posted_date && (
            <div className="info-item">
              <span className="info-label">📅 Posted</span>
              <span className="info-value">
                {new Date(job.posted_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {isLoadingJobDetails && (
          <div className="loading-indicator">
            <div className="loading-spinner-small"></div>
            <p>Loading full job description...</p>
          </div>
        )}

        {job.description && (
          <div className="job-description-full">
            <h3>Job Description</h3>
            <div className="description-content">
              {job.description}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetails

