import { useState, useEffect } from 'react'
import { templatesService } from '@/services/templatesService'
import { jobsService } from '@/services/jobsService'
import type { TypstTemplate, CoverLetterResponse } from '@/types/api'
import './JobDescriptionPage.css'

const JobDescriptionPage = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobLocation, setJobLocation] = useState('')
  const [templates, setTemplates] = useState<TypstTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [templatesError, setTemplatesError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [customInstructions, setCustomInstructions] = useState('')
  const [language, setLanguage] = useState('english')
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    if (!jobDescription.trim() || !jobTitle.trim() || !companyName.trim() || !jobLocation.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (!selectedTemplate) {
      setError('Please select a template')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const result = await jobsService.createCoverLetterSimple({
        template_id: selectedTemplate,
        position_title: jobTitle,
        company_name: companyName,
        job_location: jobLocation,
        job_description: jobDescription,
        language: language || null,
        customer_instructions: customInstructions || '',
      })
      setCoverLetterResult(result)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to generate cover letter'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = () => {
    if (!coverLetterResult || !coverLetterResult.pdf_base64) {
      setError('PDF not available')
      return
    }

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
      link.download = `cover-letter-${companyName || 'job'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download PDF:', err)
      setError('Failed to download PDF')
    }
  }

  const handleReset = () => {
    setCoverLetterResult(null)
    setJobDescription('')
    setJobTitle('')
    setCompanyName('')
    setJobLocation('')
    setSelectedTemplate(null)
    setCustomInstructions('')
    setLanguage('english')
    setError(null)
  }

  return (
    <div className="job-description-page">
      <div className="container">
        <div className="page-header">
          <h1>Generate from Job Description</h1>
          <p>Paste or type a job description to create your perfect cover letter</p>
        </div>

        {!coverLetterResult ? (
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

            {/* Template Selection */}
            <div className="form-section">
              <h3 className="form-label">
                <span>📄</span>
                Select a Template
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

            {/* Language Selection */}
            <div className="form-section">
              <h3 className="form-label">
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
            <div className="form-section">
              <h3 className="form-label">
                <span>💬</span>
                Custom Instructions (Optional)
              </h3>
              <textarea
                className="custom-instructions-input"
                placeholder="Add any specific instructions for the AI to customize your cover letter..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
              />
            </div>

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
                disabled={!jobDescription.trim() || !jobTitle.trim() || !companyName.trim() || !jobLocation.trim() || !selectedTemplate}
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
        ) : (
          /* Cover Letter Result */
          <div className="cover-letter-result">
            <div className="result-header">
              <h3 className="result-title">Your Cover Letter</h3>
              <div className="result-actions">
                {coverLetterResult.pdf_base64 && (
                  <button className="download-button" onClick={handleDownloadPDF}>
                    <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                )}
                <button className="generate-another-button" onClick={handleReset}>
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
  )
}

export default JobDescriptionPage

