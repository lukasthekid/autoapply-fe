import { useState, useEffect, FormEvent } from 'react'
import { jobsService } from '@/services/jobsService'
import { templatesService } from '@/services/templatesService'
import type { 
  JobSearchRequest, 
  JobListing, 
  JobType, 
  ExperienceLevel, 
  DatePosted,
  TypstTemplate,
  CoverLetterResponse
} from '@/types/api'
import './JobSearchPage.css'

const JobSearchPage = () => {
  const [searchParams, setSearchParams] = useState<JobSearchRequest>({
    keyword: '',
    location: '',
    job_types: null,
    experience_levels: null,
    date_posted: 'any_time',
    limit: 25,
  })
  
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)
  const [isLoadingJobDetails, setIsLoadingJobDetails] = useState(false)
  const [jobDetailError, setJobDetailError] = useState<string | null>(null)
  
  // Cover letter generation state
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setSearchParams(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleMultiSelectChange = (
    name: 'job_types' | 'experience_levels',
    value: string
  ) => {
    setSearchParams(prev => {
      const currentValues = prev[name] || []
      const isSelected = currentValues.includes(value as any)
      
      if (isSelected) {
        // Remove from array
        const newValues = currentValues.filter(v => v !== value)
        return {
          ...prev,
          [name]: newValues.length > 0 ? newValues : null,
        }
      } else {
        // Add to array
        return {
          ...prev,
          [name]: [...currentValues, value] as any,
        }
      }
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!searchParams.keyword.trim() || !searchParams.location.trim()) {
      setError('Please enter both keyword and location')
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    setSelectedJob(null) // Clear selected job when searching

    try {
      const response = await jobsService.searchJobs(searchParams)
      setJobs(response.jobs)
      setTotalResults(response.total_results)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to search jobs'
      setError(errorMessage)
      setJobs([])
      setTotalResults(0)
    } finally {
      setIsSearching(false)
    }
  }

  const handleViewJob = async (job: JobListing) => {
    setIsLoadingJobDetails(true)
    setJobDetailError(null)
    setSelectedJob(job) // Set immediately with basic data
    setShowCoverLetterGenerator(false) // Reset cover letter view
    setCoverLetterResult(null)

    try {
      // Enrich job details from LinkedIn
      const enrichedJob = await jobsService.enrichJobDetails(job.job_id)
      setSelectedJob(enrichedJob)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to load job details'
      setJobDetailError(errorMessage)
      // Keep the basic job data even if enrichment fails
    } finally {
      setIsLoadingJobDetails(false)
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

  const handleGenerateCoverLetterSubmit = async () => {
    if (!selectedJob || !selectedTemplate) {
      setGenerateError('Please select a template')
      return
    }

    setIsGenerating(true)
    setGenerateError(null)

    try {
      const result = await jobsService.createCoverLetter({
        job_id: selectedJob.job_id,
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

  const handleDownloadPDF = () => {
    if (!coverLetterResult) return

    try {
      // Convert base64 to blob
      const byteCharacters = atob(coverLetterResult.pdf_base64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `cover-letter-${selectedJob?.company_name || 'job'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download PDF:', err)
      setGenerateError('Failed to download PDF')
    }
  }

  const handleGenerateAnother = () => {
    setCoverLetterResult(null)
    setSelectedTemplate(null)
    setCustomInstructions('')
    setLanguage('english')
    setGenerateError(null)
  }

  const jobTypes: { value: JobType; label: string }[] = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' },
  ]

  const experienceLevels: { value: ExperienceLevel; label: string }[] = [
    { value: 'internship', label: 'Internship' },
    { value: 'entry_level', label: 'Entry Level' },
    { value: 'associate', label: 'Associate' },
    { value: 'mid_senior_level', label: 'Mid-Senior Level' },
    { value: 'director', label: 'Director' },
  ]

  const datePostedOptions: { value: DatePosted; label: string }[] = [
    { value: 'any_time', label: 'Any time' },
    { value: 'past_24_hours', label: 'Past 24 hours' },
    { value: 'past_week', label: 'Past week' },
    { value: 'past_month', label: 'Past month' },
  ]

  return (
    <div className="job-search-page">
      <div className="container">
        <div className="job-search-header">
          <h1>Find Your Next Opportunity</h1>
          <p>Search thousands of Jobs</p>
        </div>

        <form onSubmit={handleSubmit} className="job-search-form">
          <div className="search-main">
            {/* Job Title Input */}
            <div className="search-input-wrapper">
              <svg 
                className="input-icon"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <div className="input-content">
                <label htmlFor="keyword" className="input-label">Job Title</label>
                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={searchParams.keyword}
                  onChange={handleInputChange}
                  placeholder="Software Engineer, Data Scientist..."
                  className="search-input"
                  required
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="search-input-wrapper">
              <svg 
                className="input-icon"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div className="input-content">
                <label htmlFor="location" className="input-label">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={searchParams.location}
                  onChange={handleInputChange}
                  placeholder="Vienna, Austria..."
                  className="search-input"
                  required
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="search-button-wrapper">
              <button
                type="submit"
                className="btn-search-modern"
                disabled={isSearching}
                title={isSearching ? 'Searching...' : 'Search Jobs'}
              >
                {isSearching ? (
                  <>
                    <div className="loading-spinner-search"></div>
                    <span>Searching</span>
                  </>
                ) : (
                  <>
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="search-icon"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <details className="search-filters" open>
            <summary>🎯 Advanced Filters</summary>
            
            <div className="filters-content">
              <div className="filter-group">
                <label className="filter-label">💼 Job Type</label>
                <div className="pill-group">
                  {jobTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      className={`filter-pill ${searchParams.job_types?.includes(type.value) ? 'active' : ''}`}
                      onClick={() => handleMultiSelectChange('job_types', type.value)}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">📊 Experience Level</label>
                <div className="pill-group">
                  {experienceLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      className={`filter-pill ${searchParams.experience_levels?.includes(level.value) ? 'active' : ''}`}
                      onClick={() => handleMultiSelectChange('experience_levels', level.value)}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label" htmlFor="date_posted">📅 Date Posted</label>
                  <div className="custom-select">
                    <select
                      id="date_posted"
                      name="date_posted"
                      value={searchParams.date_posted || 'any_time'}
                      onChange={handleInputChange}
                    >
                      {datePostedOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label" htmlFor="limit">🔢 Results Limit</label>
                  <div className="custom-select">
                    <select
                      id="limit"
                      name="limit"
                      value={searchParams.limit || 25}
                      onChange={handleInputChange}
                    >
                      <option value="10">10 results</option>
                      <option value="25">25 results</option>
                      <option value="50">50 results</option>
                      <option value="100">100 results</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </form>

        {error && (
          <div className="search-error">
            {error}
          </div>
        )}

        {hasSearched && !isSearching && (
          <div className="search-results-container">
            <div className="results-sidebar">
              <div className="results-header">
                <h2>
                  {jobs.length > 0
                    ? `${totalResults.toLocaleString()} jobs`
                    : 'No jobs found'}
                </h2>
                <p className="results-count">Showing {jobs.length}</p>
              </div>

              <div className="jobs-list">
                {jobs.map(job => (
                  <div 
                    key={job.job_id} 
                    className={`job-card-compact ${selectedJob?.job_id === job.job_id ? 'selected' : ''} ${isLoadingJobDetails && selectedJob?.job_id === job.job_id ? 'loading' : ''}`}
                    onClick={() => handleViewJob(job)}
                  >
                    <div className="job-card-header">
                      {job.company_logo_url && (
                        <img
                          src={job.company_logo_url}
                          alt={`${job.company_name} logo`}
                          className="company-logo-small"
                        />
                      )}
                      <div className="job-title-company">
                        <h3>{job.title}</h3>
                        <p className="company-name">{job.company_name}</p>
                      </div>
                    </div>
                    
                    <div className="job-meta">
                      <span className="job-location">📍 {job.location}</span>
                      {job.applicants_count && (
                        <span className="job-applicants">
                          👥 {job.applicants_count}
                        </span>
                      )}
                    </div>

                    <div className="job-card-footer">
                      {isLoadingJobDetails && selectedJob?.job_id === job.job_id ? (
                        <span className="loading-text">
                          <div className="loading-spinner-tiny"></div>
                          Loading...
                        </span>
                      ) : (
                        <span className="view-text">
                          View Details →
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="job-details-panel">
              {!selectedJob ? (
                <div className="no-job-selected">
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>Select a job to view details</h3>
                    <p>Click "View" on any job to see the full description and details</p>
                  </div>
                </div>
              ) : showCoverLetterGenerator ? (
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
                          Example: "Emphasize my experience with React and TypeScript" or "Mention my passion for remote work"
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
                            <polyline points="10 9 9 9 8 9"/>
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
              ) : (
                <div className="job-details-content">
                  {jobDetailError && (
                    <div className="job-detail-error">
                      ⚠️ {jobDetailError}
                    </div>
                  )}
                  
                  <div className="job-header-full">
                    <div className="job-header-left">
                      {selectedJob.company_logo_url && (
                        <img
                          src={selectedJob.company_logo_url}
                          alt={`${selectedJob.company_name} logo`}
                          className="company-logo-large"
                        />
                      )}
                      <div>
                        <h2>{selectedJob.title}</h2>
                        <p className="company-name-large">{selectedJob.company_name}</p>
                      </div>
                    </div>
                    
                    <div className="job-header-actions">
                      <a
                        href={selectedJob.linkedin_url}
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
                    </div>
                  </div>

                  <div className="job-info-grid">
                    <div className="info-item">
                      <span className="info-label">📍 Location</span>
                      <span className="info-value">{selectedJob.location}</span>
                    </div>
                    {selectedJob.employment_type && (
                      <div className="info-item">
                        <span className="info-label">💼 Employment Type</span>
                        <span className="info-value">{selectedJob.employment_type}</span>
                      </div>
                    )}
                    {selectedJob.experience_level && (
                      <div className="info-item">
                        <span className="info-label">📊 Experience Level</span>
                        <span className="info-value">{selectedJob.experience_level}</span>
                      </div>
                    )}
                    {selectedJob.applicants_count && (
                      <div className="info-item">
                        <span className="info-label">👥 Applicants</span>
                        <span className="info-value">{selectedJob.applicants_count}</span>
                      </div>
                    )}
                    {selectedJob.posted_date && (
                      <div className="info-item">
                        <span className="info-label">📅 Posted</span>
                        <span className="info-value">
                          {new Date(selectedJob.posted_date).toLocaleDateString()}
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

                  {selectedJob.description && (
                    <div className="job-description-full">
                      <h3>Job Description</h3>
                      <div className="description-content">
                        {selectedJob.description}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobSearchPage

