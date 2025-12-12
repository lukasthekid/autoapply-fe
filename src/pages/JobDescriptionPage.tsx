import { useState } from 'react'
import JobDetails from '@/components/JobDetails'
import { jobsService } from '@/services/jobsService'
import type { JobListing } from '@/types/api'
import './JobDescriptionPage.css'

const JobDescriptionPage = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [createdJob, setCreatedJob] = useState<JobListing | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddJob = async () => {
    if (!jobDescription.trim() || !jobTitle.trim() || !companyName.trim() || !jobUrl.trim()) {
      setError('Please fill in all required fields')
      return
    }
    setError(null)

    setIsSubmitting(true)
    try {
      const newJob = await jobsService.createJobListing({
        title: jobTitle.trim(),
        company_name: companyName.trim(),
        linkedin_url: jobUrl.trim(),
        description: jobDescription.trim(),
      })
      setCreatedJob(newJob)
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'Failed to add job. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setJobDescription('')
    setJobTitle('')
    setCompanyName('')
    setJobUrl('')
    setError(null)
    setCreatedJob(null)
  }

  return (
    <div className="job-description-page">
      <div className="container">
        <div className="page-header">
          <h1>Generate from Job Description</h1>
          <p>Paste or type a job description to create your perfect cover letter</p>
        </div>

        {!createdJob ? (
          <div className="generation-form">
            {/* Job Details */}
            <div className="form-row">
              <div className="form-section half">
                <label htmlFor="job-title" className="form-label">
                  <span>💼</span>
                  Job Title *
                </label>
                <input
                  type="text"
                  id="job-title"
                  className="text-input"
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="form-section half">
                <label htmlFor="company-name" className="form-label">
                  <span>🏢</span>
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company-name"
                  className="text-input"
                  placeholder="e.g. Tech Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-section">
              <label htmlFor="job-url" className="form-label">
                <span>🔗</span>
                Job URL *
              </label>
              <div className="form-row">
                <div className="form-section full">
                  <input
                    type="url"
                    id="job-url"
                    className="text-input"
                    placeholder="https://www.linkedin.com/jobs/view/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="form-section">
              <label htmlFor="job-description" className="form-label">
                <span>📝</span>
                Job Description *
              </label>
              <textarea
                id="job-description"
                className="description-textarea"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {error && (
              <div className="error-message">⚠️ {error}</div>
            )}

            {/* Generate Button */}
            <button
              className="generate-button"
              onClick={handleAddJob}
              disabled={
                !jobDescription.trim() ||
                !jobTitle.trim() ||
                !companyName.trim() ||
                !jobUrl.trim() ||
                isSubmitting
              }
            >
              <svg className="generate-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              {isSubmitting ? 'Adding Job...' : 'Add Job'}
            </button>
          </div>
        ) : (
          <div className="generation-form">
            <JobDetails
              job={createdJob}
              onStartOver={handleReset}
              showStartOverButton
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDescriptionPage

