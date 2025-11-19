import { useState } from 'react'
import { jobsService } from '@/services/jobsService'
import CoverLetterGenerator from '@/components/CoverLetterGenerator'
import JobDetails from '@/components/JobDetails'
import type { JobListing } from '@/types/api'
import './LinkedInUrlPage.css'

const LinkedInUrlPage = () => {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [job, setJob] = useState<JobListing | null>(null)
  
  // Cover letter generation state
  const [showCoverLetterGenerator, setShowCoverLetterGenerator] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!linkedinUrl.trim()) {
      setError('Please enter a LinkedIn job URL')
      return
    }

    setIsCreatingJob(true)
    setError(null)

    try {
      // Create job from LinkedIn URL
      const createdJob = await jobsService.createJobFromUrl({ linkedin_url: linkedinUrl })
      setJob(createdJob)
      // Optionally enrich the job details
      try {
        const enrichedJob = await jobsService.enrichJobDetails(createdJob.job_id)
        setJob(enrichedJob)
      } catch (enrichErr) {
        // Keep basic job data if enrichment fails
        console.error('Failed to enrich job:', enrichErr)
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to create job from URL'
      setError(errorMessage)
    } finally {
      setIsCreatingJob(false)
    }
  }

  const handleGenerateCoverLetter = () => {
    setShowCoverLetterGenerator(true)
  }

  const handleBackToJobDetails = () => {
    setShowCoverLetterGenerator(false)
  }

  const handleStartOver = () => {
    setJob(null)
    setLinkedinUrl('')
    setShowCoverLetterGenerator(false)
    setError(null)
  }

  return (
    <div className="linkedin-url-page">
      <div className="container">
        <div className="page-header">
          <h1>Generate from LinkedIn URL</h1>
          <p>Paste a LinkedIn job URL to view details and generate cover letters</p>
        </div>

        {!job ? (
          /* URL Input Form */
          <form onSubmit={handleSubmit} className="url-input-form">
            <div className="form-section">
              <label htmlFor="linkedin-url" className="form-label">
                <span>🔗</span>
                LinkedIn Job URL
              </label>
              <input
                type="url"
                id="linkedin-url"
                className="url-input"
                placeholder="https://www.linkedin.com/jobs/view/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                required
              />
              <p className="input-hint">
                Paste the full LinkedIn job URL to fetch job details and generate cover letters
              </p>
            </div>

            {error && (
              <div className="error-message">⚠️ {error}</div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={isCreatingJob || !linkedinUrl.trim()}
            >
              {isCreatingJob ? (
                <>
                  <div className="loading-spinner-small"></div>
                  <span>Loading Job...</span>
                </>
              ) : (
                <>
                  <svg className="submit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <span>Load Job Details</span>
                </>
              )}
            </button>
          </form>
        ) : showCoverLetterGenerator ? (
          /* Cover Letter Generator */
          <div className="job-detail-panel">
            <CoverLetterGenerator
              jobId={job.job_id}
              companyName={job.company_name}
              jobTitle={job.title}
              jobLocation={job.location}
              jobUrl={job.linkedin_url}
              onBack={handleBackToJobDetails}
              showBackButton={true}
            />
          </div>
        ) : (
          <JobDetails
            job={job}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            onStartOver={handleStartOver}
            showStartOverButton={true}
          />
        )}
      </div>
    </div>
  )
}

export default LinkedInUrlPage

