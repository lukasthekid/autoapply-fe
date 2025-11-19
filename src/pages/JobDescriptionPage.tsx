import { useState } from 'react'
import CoverLetterGenerator from '@/components/CoverLetterGenerator'
import './JobDescriptionPage.css'

const JobDescriptionPage = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobLocation, setJobLocation] = useState('')
  const [showGenerator, setShowGenerator] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!jobDescription.trim() || !jobTitle.trim() || !companyName.trim() || !jobLocation.trim()) {
      setError('Please fill in all required fields')
      return
    }
    setError(null)
    setShowGenerator(true)
  }

  const handleReset = () => {
    setShowGenerator(false)
    setJobDescription('')
    setJobTitle('')
    setCompanyName('')
    setJobLocation('')
    setError(null)
  }

  return (
    <div className="job-description-page">
      <div className="container">
        <div className="page-header">
          <h1>Generate from Job Description</h1>
          <p>Paste or type a job description to create your perfect cover letter</p>
        </div>

        {!showGenerator ? (
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
              <label htmlFor="job-location" className="form-label">
                <span>📍</span>
                Job Location *
              </label>
              <input
                type="text"
                id="job-location"
                className="text-input"
                placeholder="e.g. London, UK or Remote"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
              />
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
              onClick={handleGenerate}
              disabled={!jobDescription.trim() || !jobTitle.trim() || !companyName.trim() || !jobLocation.trim()}
            >
              <svg className="generate-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Generate Cover Letter
            </button>
          </div>
        ) : (
          <div className="generation-form">
            <CoverLetterGenerator
              manualJobDetails={{
                position_title: jobTitle,
                company_name: companyName,
                job_location: jobLocation,
                job_description: jobDescription,
              }}
              companyName={companyName}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDescriptionPage

