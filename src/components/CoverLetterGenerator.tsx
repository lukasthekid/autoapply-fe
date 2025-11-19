import { useState, useEffect } from 'react'
import { templatesService } from '@/services/templatesService'
import { jobsService } from '@/services/jobsService'
import { applicationsService } from '@/services/applicationsService'
import type { TypstTemplate, CreateCoverLetterRequest, CreateCoverLetterSimpleRequest } from '@/types/api'
import './CoverLetterGenerator.css'

interface CoverLetterGeneratorProps {
  // For job-based generation (from job search or LinkedIn URL)
  jobId?: string
  companyName?: string
  jobTitle?: string
  jobLocation?: string
  jobUrl?: string
  
  // For manual generation (from job description page)
  manualJobDetails?: {
    position_title: string
    company_name: string
    job_location: string
    job_description: string
  }
  
  // Optional callbacks
  onBack?: () => void
  onReset?: () => void
  showBackButton?: boolean
}

const CoverLetterGenerator = ({
  jobId,
  companyName,
  jobTitle,
  jobLocation,
  jobUrl,
  manualJobDetails,
  onBack,
  onReset,
  showBackButton = false,
}: CoverLetterGeneratorProps) => {
  const [templates, setTemplates] = useState<TypstTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [templatesError, setTemplatesError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [customInstructions, setCustomInstructions] = useState('')
  const [language, setLanguage] = useState('english')
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetterText, setCoverLetterText] = useState('')
  const [isConvertingToPdf, setIsConvertingToPdf] = useState(false)
  const [isAddingToApplications, setIsAddingToApplications] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [isCheckingApplication, setIsCheckingApplication] = useState(true) // Start as true to show loading
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if user has already applied to this job - runs every time component loads
  useEffect(() => {
    // Reset state every time component loads
    setHasApplied(false)
    setIsCheckingApplication(true)
    setSuccessMessage(null)
    
    const checkApplication = async () => {
      // Only check if we have the required information
      const finalCompanyName = companyName || manualJobDetails?.company_name
      const finalJobTitle = jobTitle || manualJobDetails?.position_title
      
      if (!finalCompanyName || !finalJobTitle) {
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

        // Priority order: job_id → job_url → job_title + company_name
        if (jobId) {
          params.job_id = jobId
        } else if (jobUrl) {
          params.job_url = jobUrl
        } else {
          params.job_title = finalJobTitle
          params.company_name = finalCompanyName
        }

        const result = await applicationsService.checkApplication(params)
        setHasApplied(result.has_applied)
      } catch (err) {
        // Silently fail - if check fails, we'll just show the button
        console.error('Failed to check application status:', err)
        setHasApplied(false)
      } finally {
        setIsCheckingApplication(false)
      }
    }

    // Always check when component loads or when relevant props change
    checkApplication()
  }, [jobId, jobUrl, jobTitle, companyName, manualJobDetails?.company_name, manualJobDetails?.position_title])

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

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      let result
      if (jobId) {
        // Generate from job ID
        const request: CreateCoverLetterRequest = {
          job_id: jobId,
          language: language || null,
          customer_instructions: customInstructions || '',
        }
        result = await jobsService.createCoverLetter(request)
      } else if (manualJobDetails) {
        // Generate from manual job details
        const request: CreateCoverLetterSimpleRequest = {
          position_title: manualJobDetails.position_title,
          company_name: manualJobDetails.company_name,
          job_location: manualJobDetails.job_location,
          job_description: manualJobDetails.job_description,
          language: language || null,
          customer_instructions: customInstructions || '',
        }
        result = await jobsService.createCoverLetterSimple(request)
      } else {
        setError('Invalid configuration: either jobId or manualJobDetails must be provided')
        return
      }
      
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

    const finalCompanyName = companyName || manualJobDetails?.company_name || 'job'
    
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
    const finalCompanyName = companyName || manualJobDetails?.company_name
    const finalJobTitle = jobTitle || manualJobDetails?.position_title
    const finalJobLocation = jobLocation || manualJobDetails?.job_location

    if (!finalCompanyName || !finalJobTitle) {
      setError('Missing required job information to add to applications')
      return
    }

    setIsAddingToApplications(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await applicationsService.createApplication({
        job_id: jobId || null,
        job_title: finalJobTitle,
        company_name: finalCompanyName,
        job_location: finalJobLocation || null,
        job_url: jobUrl || null,
        notes: null,
      })
      setSuccessMessage('Job successfully added to your applications!')
      setHasApplied(true) // Update state to show checkmark
      // Clear success message after 5 seconds
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

  const handleReset = () => {
    setCoverLetterText('')
    setSelectedTemplate(null)
    setCustomInstructions('')
    setLanguage('english')
    setError(null)
    setSuccessMessage(null)
    if (onReset) {
      onReset()
    }
  }

  // If cover letter has been generated, show the result view
  if (coverLetterText) {
    return (
      <div className="cover-letter-generator">
        {showBackButton && onBack && (
          <div className="generator-header">
            <h2>
              <span>✨</span>
              Generate Cover Letter
            </h2>
            <div className="generator-header-actions">
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
                  disabled={isAddingToApplications || !(companyName || manualJobDetails?.company_name) || !(jobTitle || manualJobDetails?.position_title)}
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
              <button className="back-button" onClick={onBack}>
                <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Job
              </button>
            </div>
          </div>
        )}

        <div className="cover-letter-result">
          <div className="result-header">
            <h3 className="result-title">Your Cover Letter</h3>
            <p className="result-subtitle">Review and edit your cover letter text below. You can make any changes you'd like before downloading.</p>
            <div className="result-actions">
              <button className="generate-another-button" onClick={handleReset}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Generate Another
              </button>
            </div>
          </div>

          {/* Editable Cover Letter Text */}
          <div className="form-section">
            <label htmlFor="cover-letter-editor" className="form-label">
              <span>✏️</span>
              Cover Letter Text
            </label>
            <textarea
              id="cover-letter-editor"
              className="cover-letter-editor"
              value={coverLetterText}
              onChange={(e) => setCoverLetterText(e.target.value)}
              rows={20}
            />
          </div>

          {/* Template Selection for Download */}
          <div className="form-section">
            <h3 className="form-label">
              <span>📄</span>
              Select a Template for Download
            </h3>
            {isLoadingTemplates ? (
              <div className="templates-loading">
                <div className="loading-spinner-small"></div>
                <p>Loading templates...</p>
              </div>
            ) : templatesError ? (
              <div className="error-message">⚠️ {templatesError}</div>
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

          {successMessage && (
            <div className="success-message">✅ {successMessage}</div>
          )}

          {error && (
            <div className="error-message">⚠️ {error}</div>
          )}

          {/* Download Button */}
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
        </div>
      </div>
    )
  }

  // Show the generation form
  return (
    <div className="cover-letter-generator">
      {showBackButton && onBack && (
        <div className="generator-header">
          <h2>
            <span>✨</span>
            Generate Cover Letter
          </h2>
          <div className="generator-header-actions">
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
                disabled={isAddingToApplications || !(companyName || manualJobDetails?.company_name) || !(jobTitle || manualJobDetails?.position_title)}
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
            <button className="back-button" onClick={onBack}>
              <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Job
            </button>
          </div>
        </div>
      )}

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
          disabled={isGenerating}
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
  )
}

export default CoverLetterGenerator

