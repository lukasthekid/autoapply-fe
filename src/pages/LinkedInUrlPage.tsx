import { useState, useEffect } from 'react'
import { templatesService } from '@/services/templatesService'
import { jobsService } from '@/services/jobsService'
import type { 
  TypstTemplate, 
  CoverLetterResponse, 
  JobListing 
} from '@/types/api'
import './LinkedInUrlPage.css'

const LinkedInUrlPage = () => {
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [job, setJob] = useState<JobListing | null>(null)
  
  // Cover letter generation state (same as JobSearchPage)
  const [showCoverLetterGenerator, setShowCoverLetterGenerator] = useState(false)
  const [templates, setTemplates] = useState<TypstTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [templatesError, setTemplatesError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [customInstructions, setCustomInstructions] = useState('')
  const [language, setLanguage] = useState('english')
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResponse | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)

  // Fetch templates when cover letter generator is shown
  useEffect(() => {
    if (showCoverLetterGenerator && templates.length === 0) {
      const fetchTemplates = async () => {
        setIsLoadingTemplates(true)
        setTemplatesError(null)
        try {
          const response = await templatesService.getAllTemplates()
          setTemplates(response.templates)
        } catch (err: any) {
          const errorMessage = err?.response?.data?.error || err?.message || 'Failed to load templates'
          setTemplatesError(errorMessage)
        } finally {
          setIsLoadingTemplates(false)
        }
      }
      fetchTemplates()
    }
  }, [showCoverLetterGenerator, templates.length])

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
    setCoverLetterResult(null)
    setSelectedTemplate(null)
    setCustomInstructions('')
    setLanguage('english')
    setGenerateError(null)
  }

  const handleBackToJobDetails = () => {
    setShowCoverLetterGenerator(false)
    setCoverLetterResult(null)
    setGenerateError(null)
  }

  const handleGenerateCoverLetterSubmit = async () => {
    if (!job || !selectedTemplate) {
      setGenerateError('Please select a template')
      return
    }

    setIsGenerating(true)
    setGenerateError(null)

    try {
      const result = await jobsService.createCoverLetter({
        job_id: job.job_id,
        template_id: selectedTemplate,
        language: language || null,
        customer_instructions: customInstructions || '',
      })
      setCoverLetterResult(result)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to generate cover letter'
      setGenerateError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateAnother = () => {
    setCoverLetterResult(null)
    setSelectedTemplate(null)
    setCustomInstructions('')
    setLanguage('english')
    setGenerateError(null)
  }

  const handleDownloadPDF = () => {
    if (!coverLetterResult) return

    try {
      const byteCharacters = atob(coverLetterResult.pdf_base64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `cover-letter-${job?.company_name || 'job'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download PDF:', err)
      setGenerateError('Failed to download PDF')
    }
  }

  const handleStartOver = () => {
    setJob(null)
    setLinkedinUrl('')
    setShowCoverLetterGenerator(false)
    setCoverLetterResult(null)
    setError(null)
    setGenerateError(null)
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
            <div className="cover-letter-generator">
              <div className="generator-header">
                <h2>
                  <span>✨</span>
                  Generate Cover Letter
                </h2>
                <button className="back-button" onClick={handleBackToJobDetails}>
                  <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to Job
                </button>
              </div>

              {!coverLetterResult ? (
                <>
                  {/* Template Selection */}
                  <div className="generator-section">
                    <h3 className="section-title">
                      <span>📄</span>
                      Select a Template
                    </h3>
                    {isLoadingTemplates ? (
                      <div className="templates-loading">
                        <div className="loading-spinner-small"></div>
                        <p>Loading templates...</p>
                      </div>
                    ) : templatesError ? (
                      <div className="templates-error">⚠️ {templatesError}</div>
                    ) : (
                      <div className="templates-grid">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <img
                              src={`/${template.name}.png`}
                              alt={template.name}
                              className="template-preview"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-template.png'
                              }}
                            />
                            <p className="template-name">{template.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Language Selection */}
                  <div className="generator-section">
                    <h3 className="section-title">
                      <span>🌐</span>
                      Cover Letter Language
                    </h3>
                    <select
                      className="language-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="english">English</option>
                      <option value="german">German (Deutsch)</option>
                      <option value="french">French (Français)</option>
                      <option value="spanish">Spanish (Español)</option>
                      <option value="italian">Italian (Italiano)</option>
                    </select>
                  </div>

                  {/* Custom Instructions */}
                  <div className="generator-section">
                    <h3 className="section-title">
                      <span>💬</span>
                      Custom Instructions (Optional)
                    </h3>
                    <textarea
                      className="custom-instructions-input"
                      placeholder="Add any specific instructions for the AI to customize your cover letter..."
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                    />
                    <p className="input-hint">
                      Example: "Emphasize my experience with React and TypeScript"
                    </p>
                  </div>

                  {generateError && (
                    <div className="templates-error">⚠️ {generateError}</div>
                  )}

                  {/* Generate Button */}
                  {isGenerating ? (
                    <div className="generating-overlay">
                      <div className="generating-spinner"></div>
                      <p className="generating-text">Generating your cover letter...</p>
                      <p className="generating-subtext">This may take a few moments</p>
                    </div>
                  ) : (
                    <button
                      className="generate-button"
                      onClick={handleGenerateCoverLetterSubmit}
                      disabled={!selectedTemplate}
                    >
                      <svg className="generate-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      Generate Cover Letter
                    </button>
                  )}
                </>
              ) : (
                /* Cover Letter Result */
                <div className="cover-letter-result">
                  <div className="result-header">
                    <h3 className="result-title">Your Cover Letter</h3>
                    <div className="result-actions">
                      <button className="download-button" onClick={handleDownloadPDF}>
                        <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download PDF
                      </button>
                      <button className="generate-another-button" onClick={handleGenerateAnother}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="23 4 23 10 17 10"/>
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                        </svg>
                        Generate Another
                      </button>
                    </div>
                  </div>
                  <div className="cover-letter-text">
                    {coverLetterResult.cover_letter_text}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Job Details View - Same as JobSearchPage */
          <div className="job-detail-panel">
            <div className="job-details-content">
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
                    onClick={handleGenerateCoverLetter}
                  >
                    <span>Generate</span>
                    <span>Cover Letter</span>
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={handleStartOver}
                  >
                    Try Another URL
                  </button>
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
        )}
      </div>
    </div>
  )
}

export default LinkedInUrlPage

