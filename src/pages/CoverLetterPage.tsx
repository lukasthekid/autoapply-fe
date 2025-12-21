import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { jobsService } from '@/services/jobsService'
import { authService } from '@/services/authService'
import type { CreateCoverLetterRequest, UserProfile } from '@/types/api'
import CoverLetterPreview from '@/components/CoverLetterPreview'

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

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [customInstructions, setCustomInstructions] = useState('')
  const [language, setLanguage] = useState('english')
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetterText, setCoverLetterText] = useState(state?.coverLetterText || '')
  const [coverLetterHtml, setCoverLetterHtml] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Helper function to convert plain text to HTML
  const convertTextToHtml = (text: string): string => {
    if (!text) return ''
    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/)
    return paragraphs
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('')
  }

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true)
      try {
        const profile = await authService.getProfile()
        setUserProfile(profile)
      } catch (err: any) {
        console.error('Failed to fetch user profile:', err)
        setError('Failed to load user profile')
      } finally {
        setIsLoadingProfile(false)
      }
    }
    fetchUserProfile()
  }, [])

  // If we have cover letter text from state, use it
  useEffect(() => {
    if (state?.coverLetterText) {
      setCoverLetterText(state.coverLetterText)
      setCoverLetterHtml(convertTextToHtml(state.coverLetterText))
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
      setCoverLetterHtml(convertTextToHtml(result.cover_letter_text))
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to generate cover letter'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }


  // If no job data, redirect back
  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No job selected</h2>
            <p className="text-gray-600 mb-6">Please select a job first to generate a cover letter.</p>
            <button 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              onClick={() => navigate('/jobs')}
            >
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cover Letter</h1>
              <p className="text-gray-600">Click anywhere in the document body to edit. Use the toolbar to format your text.</p>
            </div>
            <button 
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-gray-700 font-medium"
              onClick={() => {
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
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* Single Panel - Inline WYSIWYG Editor */}
          <CoverLetterPreview
            content={coverLetterHtml}
            userProfile={userProfile}
            companyName={state.companyName}
            jobTitle={state.jobTitle}
            onChange={setCoverLetterHtml}
          />
        </div>
      </div>
    )
  }

  // Show the generation form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Cover Letter</h1>
            <p className="text-gray-600">Create a personalized cover letter for {state.companyName || 'this job'}</p>
          </div>
          <button 
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-gray-700 font-medium"
            onClick={() => {
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
            }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>

        <div className="space-y-6">
          {/* User Profile Information */}
          {isLoadingProfile ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Your Information
              </h3>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p>Loading your profile...</p>
              </div>
            </div>
          ) : userProfile ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Your Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {(userProfile.first_name || userProfile.last_name) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{[userProfile.first_name, userProfile.last_name].filter(Boolean).join(' ')}</p>
                  </div>
                )}
                {userProfile.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{userProfile.email}</p>
                  </div>
                )}
                {userProfile.phone_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{userProfile.phone_number}</p>
                  </div>
                )}
                {(userProfile.street || userProfile.city || userProfile.postcode) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-gray-900">
                      {[
                        userProfile.street,
                        userProfile.city,
                        userProfile.postcode,
                        userProfile.country_display || userProfile.country
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                This information will be used to personalize your cover letter. You can update it in{' '}
                <button 
                  className="text-blue-600 hover:text-blue-700 underline font-medium" 
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </button>
              </p>
            </div>
          ) : null}

          {/* Language Selection */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              Cover Letter Language
            </h3>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
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
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              Custom Instructions (Optional)
            </h3>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Add any specific instructions for the AI to customize your cover letter..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={4}
            />
            <p className="mt-2 text-sm text-gray-600">
              Example: "Emphasize my experience with React and TypeScript" or "Mention my passion for remote work"
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* Generate Button */}
          {isGenerating ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
              <p className="text-lg font-medium text-gray-900 mb-2">Generating your cover letter...</p>
              <p className="text-sm text-gray-600">This may take a few moments</p>
            </div>
          ) : (
            <button
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerate}
              disabled={isGenerating || !state.jobId}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    </div>
  )
}

export default CoverLetterPage

