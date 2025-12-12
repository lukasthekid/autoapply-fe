import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { templatesService } from '@/services/templatesService'
import { jobsService } from '@/services/jobsService'
import { applicationsService } from '@/services/applicationsService'
import type { TypstTemplate, CreateCoverLetterRequest } from '@/types/api'
import './CoverLetterPage.css'

const CoverLetterPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as {
    jobId?: string
    companyName?: string
    jobTitle?: string
    jobLocation?: string
    jobUrl?: string
    coverLetterText?: string
    returnPath?: string
    job?: any // Full job object for restoration
    searchState?: {
      jobs?: any[]
      searchParams?: any
      hasSearched?: boolean
      totalResults?: number
    }
  } | null

  const [templates, setTemplates] = useState<TypstTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [templatesError, setTemplatesError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [customInstructions, setCustomInstructions] = useState('')
  const [language, setLanguage] = useState('english')
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetterText, setCoverLetterText] = useState(state?.coverLetterText || '')
  const [isConvertingToPdf, setIsConvertingToPdf] = useState(false)
  const [isAddingToApplications, setIsAddingToApplications] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [isCheckingApplication, setIsCheckingApplication] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if user has already applied to this job
  useEffect(() => {
    setHasApplied(false)
    setIsCheckingApplication(true)
    setSuccessMessage(null)
    
    const checkApplication = async () => {
      if (!state?.companyName || !state?.jobTitle) {
        setHasApplied(false)
        setIsCheckingApplication(false)
        return
      }
      
      try {
        const params: {
          job_id?: string
          job_url?: string
          job_title?: string
          company_name?: string
        } = {}

        if (state.jobId) {
          params.job_id = state.jobId
        } else if (state.jobUrl) {
          params.job_url = state.jobUrl
        } else {
          params.job_title = state.jobTitle
          params.company_name = state.companyName
        }

        const result = await applicationsService.checkApplication(params)
        setHasApplied(result.has_applied)
      } catch (err) {
        console.error('Failed to check application status:', err)
        setHasApplied(false)
      } finally {
        setIsCheckingApplication(false)
      }
    }

    checkApplication()
  }, [state?.jobId, state?.jobUrl, state?.jobTitle, state?.companyName])

  // Fetch templates on mount
  useEffect(() => {
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
  }, [])

  // If we have cover letter text from state, use it
  useEffect(() => {
    if (state?.coverLetterText) {
      setCoverLetterText(state.coverLetterText)
    }
  }, [state?.coverLetterText])

  const handleGenerate = async () => {
    if (!state?.jobId) {
      setError('Job ID is required to generate cover letter')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const request: CreateCoverLetterRequest = {
        job_id: state.jobId,
        language: language || null,
        customer_instructions: customInstructions || '',
      }
      const result = await jobsService.createCoverLetter(request)
      setCoverLetterText(result.cover_letter_text)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to generate cover letter'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!coverLetterText.trim()) {
      setError('Cover letter text is empty')
      return
    }

    if (!selectedTemplate) {
      setError('Please select a template')
      return
    }

    const finalCompanyName = state?.companyName || 'job'
    
    setIsConvertingToPdf(true)
    setError(null)

    try {
      const result = await templatesService.convertToPdf({
        template_id: selectedTemplate,
        content: coverLetterText,
        company_name: finalCompanyName,
      })

      const byteCharacters = atob(result.pdf_base64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `cover-letter-${finalCompanyName}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Failed to download PDF:', err)
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to download PDF'
      setError(errorMessage)
    } finally {
      setIsConvertingToPdf(false)
    }
  }

  const handleAddToApplications = async () => {
    if (!state?.companyName || !state?.jobTitle) {
      setError('Missing required job information to add to applications')
      return
    }

    setIsAddingToApplications(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await applicationsService.createApplication({
        job_id: state.jobId || null,
        job_title: state.jobTitle,
        company_name: state.companyName,
        job_location: state.jobLocation || null,
        job_url: state.jobUrl || null,
        notes: null,
      })
      setSuccessMessage('Job successfully added to your applications!')
      setHasApplied(true)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to add job to applications'
      setError(errorMessage)
    } finally {
      setIsAddingToApplications(false)
    }
  }

  // If no job data, redirect back
  if (!state) {
    return (
      <div className="cover-letter-page">
        <div className="container">
          <div className="error-state">
            <h2>No job selected</h2>
            <p>Please select a job first to generate a cover letter.</p>
            <button className="btn-primary" onClick={() => navigate('/jobs')}>
              Go to Job Search
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If cover letter has been generated, show the result view
  if (coverLetterText) {
    return (
      <div className="cover-letter-page">
        <div className="container">
          <div className="cover-letter-header">
            <div className="header-left">
              <h1>Your Cover Letter</h1>
              <p>Review and edit your cover letter text below. You can make any changes you'd like before downloading.</p>
            </div>
            <div className="header-actions">
              {isCheckingApplication ? (
                <div className="checking-application-indicator">
                  <div className="loading-spinner-small"></div>
                </div>
              ) : hasApplied ? (
                <div className="applied-indicator">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>Added to Applications</span>
                </div>
              ) : (
                <button 
                  className="add-to-applications-button"
                  onClick={handleAddToApplications}
                  disabled={isAddingToApplications || !state.companyName || !state.jobTitle}
                >
                  {isAddingToApplications ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Add to Applications
                    </>
                  )}
                </button>
              )}
              <button 
                className="back-button" 
                onClick={() => {
                  if (state?.returnPath) {
                    navigate(state.returnPath, {
                      state: {
                        selectedJob: state.job,
                        restoreJob: true,
                        searchState: state.searchState, // Pass search state back
                      }
                    })
                  } else {
                    navigate(-1)
                  }
                }}
              >
                <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="success-message">✅ {successMessage}</div>
          )}

          {error && (
            <div className="error-message">⚠️ {error}</div>
          )}

          <div className="cover-letter-layout">
            {/* Left side - Cover Letter Text */}
            <div className="cover-letter-text-panel">
              <div className="panel-header">
                <h2>
                  <span>✏️</span>
                  Cover Letter Text
                </h2>
              </div>
              <textarea
                className="cover-letter-editor"
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                rows={30}
                placeholder="Your cover letter text will appear here..."
              />
            </div>

            {/* Right side - Templates */}
            <div className="templates-panel">
              <div className="panel-header">
                <h2>
                  <span>📄</span>
                  Select Template
                </h2>
              </div>
              
              {isLoadingTemplates ? (
                <div className="templates-loading">
                  <div className="loading-spinner-small"></div>
                  <p>Loading templates...</p>
                </div>
              ) : templatesError ? (
                <div className="error-message">⚠️ {templatesError}</div>
              ) : (
                <>
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

                  <button
                    className="download-button"
                    onClick={handleDownloadPDF}
                    disabled={!selectedTemplate || isConvertingToPdf || !coverLetterText.trim()}
                  >
                    {isConvertingToPdf ? (
                      <>
                        <div className="loading-spinner-small"></div>
                        Converting to PDF...
                      </>
                    ) : (
                      <>
                        <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download Cover Letter
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show the generation form
  return (
    <div className="cover-letter-page">
      <div className="container">
        <div className="cover-letter-header">
          <div className="header-left">
            <h1>Generate Cover Letter</h1>
            <p>Create a personalized cover letter for {state.companyName || 'this job'}</p>
          </div>
          <button 
            className="back-button" 
            onClick={() => {
              if (state?.returnPath) {
                navigate(state.returnPath, {
                  state: {
                    selectedJob: state.job,
                    restoreJob: true,
                    searchState: state.searchState, // Pass search state back
                  }
                })
              } else {
                navigate(-1)
              }
            }}
          >
            <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
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
            Example: "Emphasize my experience with React and TypeScript" or "Mention my passion for remote work"
          </p>
        </div>

        {successMessage && (
          <div className="success-message">✅ {successMessage}</div>
        )}

        {error && (
          <div className="error-message">⚠️ {error}</div>
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
            onClick={handleGenerate}
            disabled={isGenerating || !state.jobId}
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
      </div>
    </div>
  )
}

export default CoverLetterPage

