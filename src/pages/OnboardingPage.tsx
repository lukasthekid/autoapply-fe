import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { documentsService } from '@/services/documentsService'
import { authService } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'
import type { CountryOption } from '@/types/api'

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl animate-pulse-soft"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-6 md:p-10 max-h-[95vh] overflow-y-auto animate-scale-in">
        {/* Progress indicator */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-center gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-[200px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                currentStep > 1 
                  ? 'bg-green-500 border-2 border-green-500 text-white' 
                  : currentStep === 1 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-2 border-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                  : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
              }`}>
                {currentStep > 1 ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : '1'}
              </div>
              <div className={`text-xs font-medium text-center transition-colors ${
                currentStep === 1 ? 'text-indigo-600 font-semibold' : 'text-gray-500'
              }`}>
                Upload Documents
              </div>
            </div>

            {/* Progress line */}
            <div className="flex-1 h-0.5 bg-gray-200 -mt-6">
              <div className={`h-full transition-all duration-500 ${
                currentStep > 1 ? 'bg-green-500 w-full' : 'bg-transparent w-0'
              }`}></div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-[200px]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                currentStep === 2 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-2 border-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                  : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
              }`}>
                2
              </div>
              <div className={`text-xs font-medium text-center transition-colors ${
                currentStep === 2 ? 'text-indigo-600 font-semibold' : 'text-gray-500'
              }`}>
                Personal Information
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Document Upload */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg shadow-indigo-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Upload Your Documents
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
                Upload your documents to help us tailor your cover letters. You can upload as many documents as you want.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📄</span> What to Upload
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>Resume / CV</span>
                  </li>
                  <li className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>Reference Letters</span>
                  </li>
                  <li className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>Education Certificates</span>
                  </li>
                  <li className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>Professional Certifications</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🔒</span> Privacy & Security
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Your documents are securely stored and only used to generate customized cover letters. 
                  We use enterprise-grade encryption to protect your data.
                </p>
              </div>
            </div>

            {/* Upload Area */}
            <div className="mb-6">
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />
              
              <label 
                htmlFor="file-upload" 
                className={`block w-full p-8 md:p-12 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-50 scale-105 border-solid' 
                    : 'border-gray-300 bg-white hover:border-indigo-500 hover:bg-indigo-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p className="text-base text-gray-900">
                    <strong className="text-indigo-600">Click to upload</strong> or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PDF files only (max 5MB each)</p>
                </div>
              </label>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors group">
                        <div className="text-2xl">📄</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          disabled={isUploading}
                          className="w-8 h-8 flex items-center justify-center bg-red-100 border border-red-200 rounded-full text-red-600 text-sm hover:bg-red-200 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg flex items-start gap-3 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span className="text-sm font-medium">{uploadError}</span>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleUploadAndContinue}
              disabled={selectedFiles.length === 0 || isUploading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {isUploading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
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
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg shadow-indigo-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Personal Information
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
                Add your personal information to include in your cover letters. This step is optional and can be completed later.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5 mb-6">
              {/* Phone Number */}
              <div>
                <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>

              {/* Street Address */}
              <div>
                <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="postcode" className="block text-sm font-semibold text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={isLoadingCountries}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-white"
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

            {/* Error Message */}
            {saveError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg flex items-start gap-3 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span className="text-sm font-medium">{saveError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSaveAndContinue}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                {isSaving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
              
              <button
                onClick={handleSkip}
                disabled={isSaving}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Later
              </button>
            </div>

            {/* Helper text */}
            <p className="text-center text-sm text-gray-500 mt-4">
              You can always add this information later in your settings
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

