import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { documentsService } from '@/services/documentsService'
import { authService } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'
import type { CountryOption } from '@/types/api'
import './OnboardingPage.css'

type Step = 1 | 2

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { updateProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(false)

  // Step 1: Document upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Step 2: Personal information state
  const [formData, setFormData] = useState({
    phone_number: '',
    street: '',
    city: '',
    postcode: '',
    country: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isCheckingDocuments, setIsCheckingDocuments] = useState(true)

  // Check if user already has documents - if so, redirect to dashboard
  useEffect(() => {
    const checkDocuments = async () => {
      try {
        const status = await documentsService.getStatus()
        if (status.has_uploaded_document) {
          // User already has documents, skip onboarding
          navigate('/dashboard', { replace: true })
          return
        }
      } catch (error) {
        console.error('Failed to check document status:', error)
        // Continue with onboarding on error
      } finally {
        setIsCheckingDocuments(false)
      }
    }
    checkDocuments()
  }, [navigate])

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true)
        const countriesData = await authService.getCountries()
        setCountries(countriesData.countries)
      } catch (error) {
        console.error('Failed to load countries:', error)
      } finally {
        setIsLoadingCountries(false)
      }
    }
    loadCountries()
  }, [])

  // Step 1: Document upload handlers
  const processFiles = (files: File[]) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length !== files.length) {
      setUploadError('Only PDF files are allowed')
      return
    }

    // Check file sizes (max 5MB per file)
    const invalidFiles = pdfFiles.filter(file => file.size > 5 * 1024 * 1024)
    if (invalidFiles.length > 0) {
      setUploadError('Files must be smaller than 5MB')
      return
    }

    setSelectedFiles(prev => [...prev, ...pdfFiles])
    setUploadError(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (isUploading) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFiles(files)
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleUploadAndContinue = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one PDF file to continue')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Upload files sequentially
      for (const file of selectedFiles) {
        const base64 = await fileToBase64(file)
        await documentsService.uploadPDF({
          file_base64: base64,
          filename: file.name,
        })
      }

      // Move to step 2
      setCurrentStep(2)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Upload failed. Please try again.'
      setUploadError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  // Step 2: Personal information handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSaveError(null)
  }

  const handleSaveAndContinue = async () => {
    setIsSaving(true)
    setSaveError(null)

    try {
      // Update profile with personal information (all fields optional)
      await updateProfile({
        phone_number: formData.phone_number.trim() || null,
        street: formData.street.trim() || null,
        city: formData.city.trim() || null,
        postcode: formData.postcode.trim() || null,
        country: formData.country.trim() || null,
      })

      // Redirect to dashboard
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const errorData = err?.response?.data
      const errorMessage = errorData?.message || errorData?.detail || err?.message || 'Failed to save information. Please try again.'
      setSaveError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSkip = () => {
    // Skip step 2 and go directly to dashboard
    navigate('/dashboard', { replace: true })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Show loading state while checking documents
  if (isCheckingDocuments) {
    return (
      <div className="onboarding-page">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}>
          <div style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--primary-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Progress indicator */}
        <div className="onboarding-progress">
          <div className="progress-steps">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Upload Documents</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Personal Information</div>
            </div>
          </div>
        </div>

        {/* Step 1: Document Upload */}
        {currentStep === 1 && (
          <div className="onboarding-step">
            <div className="step-header">
              <div className="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <h1>Upload Your Documents</h1>
              <p className="subtitle">
                Upload your documents to help us tailor your cover letters. You can upload as many documents as you want.
              </p>
            </div>

            <div className="upload-info">
              <div className="info-card">
                <h3>📄 What to Upload</h3>
                <ul>
                  <li>Resume / CV</li>
                  <li>Reference Letters</li>
                  <li>Education Certificates</li>
                  <li>Professional Certifications</li>
                </ul>
              </div>

              <div className="info-card">
                <h3>🔒 Privacy & Security</h3>
                <p>
                  Your documents are securely stored and only used to generate customized cover letters. 
                  We use enterprise-grade encryption to protect your data.
                </p>
              </div>
            </div>

            <div className="upload-area">
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                disabled={isUploading}
                style={{ display: 'none' }}
              />
              
              <label 
                htmlFor="file-upload" 
                className={`upload-dropzone ${isDragging ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <p className="upload-text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="upload-hint">PDF files only (max 5MB each)</p>
              </label>

              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h3>Selected Files ({selectedFiles.length})</h3>
                  <div className="file-list">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <div className="file-icon">📄</div>
                        <div className="file-info">
                          <div className="file-name">{file.name}</div>
                          <div className="file-size">{formatFileSize(file.size)}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="remove-btn"
                          disabled={isUploading}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {uploadError}
              </div>
            )}

            <button
              onClick={handleUploadAndContinue}
              disabled={selectedFiles.length === 0 || isUploading}
              className="btn-primary btn-large btn-glow"
            >
              {isUploading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Personal Information */}
        {currentStep === 2 && (
          <div className="onboarding-step">
            <div className="step-header">
              <div className="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h1>Personal Information</h1>
              <p className="subtitle">
                Add your personal information to include in your cover letters. This step is optional and can be completed later.
              </p>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postcode">Postal Code</label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="10001"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={isLoadingCountries}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {saveError && (
              <div className="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {saveError}
              </div>
            )}

            <div className="step-actions">
              <button
                onClick={handleSaveAndContinue}
                disabled={isSaving}
                className="btn-primary btn-large btn-glow"
              >
                {isSaving ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
              <button
                onClick={handleSkip}
                disabled={isSaving}
                className="btn-secondary btn-large"
              >
                Later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

