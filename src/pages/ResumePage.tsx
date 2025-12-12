import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { resumeService } from '@/services/resumeService'
import type { CreateResumeRequest } from '@/services/resumeService'
import TystEditor from '@/components/TystEditor'
import './ResumePage.css'

const ResumePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as {
    jobId?: string
    companyName?: string
    jobTitle?: string
    jobLocation?: string
    jobUrl?: string
    jobDescription?: string
    resumeText?: string
    returnPath?: string
    job?: any
    searchState?: {
      jobs?: any[]
      searchParams?: any
      hasSearched?: boolean
      totalResults?: number
    }
  } | null

  const [language, setLanguage] = useState('english')
  const [isGenerating, setIsGenerating] = useState(false)
  const [resumeText, setResumeText] = useState(state?.resumeText || '')
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!state?.jobDescription) {
      setError('Job description is required to generate resume')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const request: CreateResumeRequest = {
        job_description: state.jobDescription,
        language: language || 'english',
      }
      const result = await resumeService.createResume(request)
      setResumeText(result.resume_text)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to generate resume'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }


  // If no job data, redirect back
  if (!state) {
    return (
      <div className="resume-page">
        <div className="container">
          <div className="error-state">
            <h2>No job selected</h2>
            <p>Please select a job first to generate a resume.</p>
            <button className="btn-primary" onClick={() => navigate('/jobs')}>
              Go to Job Search
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If resume has been generated, show the result view
  if (resumeText) {
    return (
      <div className="resume-page">
        <div className="container container-full-width">
          <div className="resume-header">
            <div className="header-left">
              <h1>Your Resume</h1>
              <p>Review and edit your resume text below. You can make any changes you'd like before downloading.</p>
            </div>
            <div className="header-actions">
              <button
                className="generate-another-button"
                onClick={() => {
                  setResumeText('')
                  setError(null)
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Generate Another
              </button>
              <button className="back-button" onClick={() => {
                if (state?.returnPath) {
                  navigate(state.returnPath, {
                    state: {
                      selectedJob: state.job,
                      restoreJob: true,
                      searchState: state.searchState,
                    }
                  })
                } else {
                  navigate(-1)
                }
              }}>
                <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">⚠️ {error}</div>
          )}

          <div className="resume-content">
            <div className="resume-text-panel">
              <TystEditor
                initialValue={resumeText}
                downloadFileName={`resume-${state?.companyName || 'job'}.pdf`}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show the generation form
  return (
    <div className="resume-page">
      <div className="container">
        <div className="resume-header">
          <div className="header-left">
            <h1>Generate Resume</h1>
            <p>Create a personalized resume for {state.companyName || 'this job'}</p>
          </div>
          <button className="back-button" onClick={() => {
            if (state?.returnPath) {
              navigate(state.returnPath, {
                state: {
                  selectedJob: state.job,
                  restoreJob: true,
                  searchState: state.searchState,
                }
              })
            } else {
              navigate(-1)
            }
          }}>
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
            Resume Language
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

        {error && (
          <div className="error-message">⚠️ {error}</div>
        )}

        {/* Generate Button */}
        {isGenerating ? (
          <div className="generating-overlay">
            <div className="generating-spinner"></div>
            <p className="generating-text">Generating your resume...</p>
            <p className="generating-subtext">This may take a few moments. Please wait...</p>
          </div>
        ) : (
          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={isGenerating || !state.jobDescription}
          >
            <svg className="generate-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
            Generate Resume
          </button>
        )}
      </div>
    </div>
  )
}

export default ResumePage

