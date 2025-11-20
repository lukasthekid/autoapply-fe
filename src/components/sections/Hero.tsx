import { useState } from 'react'
import './Hero.css'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'

type Step = 'upload' | 'job-description'

const Hero = () => {
  const { isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [inputMode, setInputMode] = useState<'url' | 'text'>('text')
  const [isDragging, setIsDragging] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup')

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    const validExtensions = ['.pdf', '.doc', '.docx']
    const fileName = file.name.toLowerCase()
    return validTypes.includes(file.type) || validExtensions.some(ext => fileName.endsWith(ext))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isValidFileType(file)) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File must be smaller than 5MB')
        return
      }
      setSelectedFile(file)
    } else {
      alert('Please upload a PDF, DOC, or DOCX file')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && isValidFileType(file)) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File must be smaller than 5MB')
        return
      }
      setSelectedFile(file)
    } else {
      alert('Please upload a PDF, DOC, or DOCX file')
    }
  }

  const handleContinue = () => {
    if (currentStep === 'upload' && selectedFile) {
      setCurrentStep('job-description')
    }
  }

  const handleGenerate = () => {
    if (currentStep === 'job-description') {
      const hasJobInfo = inputMode === 'url' ? jobUrl.trim() : jobDescription.trim()
      if (!hasJobInfo) {
        alert('Please provide a job description or URL')
        return
      }

      if (isAuthenticated) {
        // TODO: Trigger cover letter generation
        console.log('Generate cover letter for authenticated user')
      } else {
        setAuthModalMode('signup')
        setIsAuthModalOpen(true)
      }
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <>
      <section className="hero">
        <div className="hero-ambient-glow hero-ambient-glow-1" />
        <div className="hero-ambient-glow hero-ambient-glow-2" />
        <div className="hero-ambient-glow hero-ambient-glow-3" />
        <div className="container">
          <div className="hero-content">
            {/* Hero Header */}
            <div className="hero-header">
              <div className="hero-badge">
                <span>✨ Free AI Cover Letter Generator</span>
              </div>
              <h1 className="hero-title">
                Generate as many cover letters as you need
              </h1>
              <p className="hero-subtitle">
                Upload your resume, paste the job description, and get a personalized cover letter in seconds. 
                <strong> Powered by AI</strong> to create authentic, tailored content.
              </p>
              <div className="hero-cta">
                <button 
                  className="btn-primary btn-large btn-glow"
                  onClick={() => {
                    setAuthModalMode('signup')
                    setIsAuthModalOpen(true)
                  }}
                >
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Main Generator Card */}
            <div className="hero-generator">
              {/* Step 1: Upload CV */}
              {currentStep === 'upload' && (
                <div className="generator-step">
                  <div className="step-header">
                    <h3 className="step-title">Upload your resume</h3>
                    <p className="step-description">Drag and drop your CV or click to browse</p>
                  </div>
                  
                  <div className="upload-section">
                    <input
                      type="file"
                      id="cv-upload"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="cv-upload"
                      className={`upload-dropzone ${isDragging ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {selectedFile ? (
                        <div className="file-selected">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                          </svg>
                          <div className="file-details">
                            <div className="file-name">{selectedFile.name}</div>
                            <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                          </div>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFile(null)
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <p className="upload-text">
                            <strong>Drop your resume here</strong> or choose a file
                          </p>
                          <p className="upload-hint">PDF & DOCX only. Max 5MB file size.</p>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="privacy-note">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Your data is secure. We never share it with 3rd parties.</span>
                  </div>

                  {selectedFile && (
                    <button
                      className="btn-primary btn-large btn-continue"
                      onClick={handleContinue}
                    >
                      Continue
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: Job Description */}
              {currentStep === 'job-description' && (
                <div className="generator-step">
                  <div className="step-header">
                    <h3 className="step-title">Add the job description</h3>
                    <p className="step-description">Paste the job posting URL or description to personalize your cover letter</p>
                  </div>

                  <div className="input-mode-toggle">
                    <button
                      type="button"
                      className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
                      onClick={() => setInputMode('text')}
                    >
                      Job Description
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${inputMode === 'url' ? 'active' : ''}`}
                      onClick={() => setInputMode('url')}
                    >
                      Job URL
                    </button>
                  </div>

                  <div className="job-input-section">
                    {inputMode === 'url' ? (
                      <input
                        type="url"
                        className="job-input"
                        placeholder="Paste the job posting URL here..."
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                      />
                    ) : (
                      <textarea
                        className="job-textarea"
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={8}
                      />
                    )}
                  </div>

                  <div className="step-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setCurrentStep('upload')}
                    >
                      ← Back
                    </button>
                    <button
                      className="btn-primary btn-large btn-generate"
                      onClick={handleGenerate}
                      disabled={inputMode === 'url' ? !jobUrl.trim() : !jobDescription.trim()}
                    >
                      Generate Cover Letter
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  )
}

export default Hero

