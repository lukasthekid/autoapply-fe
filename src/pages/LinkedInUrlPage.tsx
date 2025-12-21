import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { jobsService } from '@/services/jobsService'
import CoverLetterGenerator from '@/components/CoverLetterGenerator'
import JobDetails from '@/components/JobDetails'
import type { JobListing } from '@/types/api'

const LinkedInUrlPage = () => {
  const location = useLocation()
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [job, setJob] = useState<JobListing | null>(null)
  const [isEnriching, setIsEnriching] = useState(false)
  
  // Cover letter generation state
  const [showCoverLetterGenerator, setShowCoverLetterGenerator] = useState(false)

  // Validate URL format
  const isValidLinkedInUrl = (url: string) => {
    if (!url) return true // Empty is okay (not filled yet)
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.includes('linkedin.com')
    } catch {
      return false
    }
  }

  const urlValid = isValidLinkedInUrl(linkedinUrl)

  // Restore job from navigation state (when returning from cover letter page)
  useEffect(() => {
    const state = location.state as { selectedJob?: JobListing; restoreJob?: boolean } | null
    if (state?.restoreJob && state?.selectedJob) {
      setJob(state.selectedJob)
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Keyboard shortcut to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (linkedinUrl.trim() && !isCreatingJob && urlValid) {
          handleSubmit(e as any)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [linkedinUrl, isCreatingJob, urlValid])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!linkedinUrl.trim()) {
      setError('Please enter a LinkedIn job URL')
      return
    }

    if (!urlValid) {
      setError('Please enter a valid LinkedIn URL')
      return
    }

    setIsCreatingJob(true)
    setError(null)

    try {
      // Create job from LinkedIn URL
      const createdJob = await jobsService.createJobFromUrl({ linkedin_url: linkedinUrl })
      setJob(createdJob)
      
      // Optionally enrich the job details
      setIsEnriching(true)
      try {
        const enrichedJob = await jobsService.enrichJobDetails(createdJob.job_id)
        setJob(enrichedJob)
      } catch (enrichErr) {
        // Keep basic job data if enrichment fails
        console.error('Failed to enrich job:', enrichErr)
      } finally {
        setIsEnriching(false)
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to create job from URL'
      setError(errorMessage)
    } finally {
      setIsCreatingJob(false)
    }
  }

  const handleBackToJobDetails = () => {
    setShowCoverLetterGenerator(false)
  }

  const handleStartOver = () => {
    setJob(null)
    setLinkedinUrl('')
    setShowCoverLetterGenerator(false)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Generate from LinkedIn URL
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Paste a LinkedIn job URL to instantly load details and generate tailored documents
          </p>
          
          {/* Decorative element */}
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {!job ? (
          /* URL Input Form */
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 animate-scale-in">
            <div className="mb-8">
              <label htmlFor="linkedin-url" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <span className="text-indigo-600 text-lg">🔗</span>
                LinkedIn Job URL
                <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="url"
                  id="linkedin-url"
                  className={`w-full px-4 py-4 border-2 rounded-xl text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 ${
                    !urlValid && linkedinUrl.trim()
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30'
                      : linkedinUrl.trim() && urlValid
                      ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50/30'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  }`}
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  required
                />
                
                {/* Visual feedback icons */}
                {linkedinUrl.trim() && urlValid && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
                
                {!urlValid && linkedinUrl.trim() && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Helper/Error text */}
              {!urlValid && linkedinUrl.trim() ? (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Please enter a valid LinkedIn job URL
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Copy the job URL directly from your browser's address bar
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg flex items-start gap-3 animate-fade-in">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center gap-3 relative overflow-hidden group"
              disabled={isCreatingJob || !linkedinUrl.trim() || !urlValid}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {isCreatingJob ? (
                <>
                  <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
                  </svg>
                  <span>Loading Job...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <span>Load Job Details</span>
                  <span className="hidden sm:inline text-sm opacity-75">(⌘↵)</span>
                </>
              )}
            </button>

            {/* Helper Text */}
            <p className="text-center text-sm text-gray-500 mt-4">
              We'll fetch the job details and you can generate documents instantly
            </p>

            {/* Example section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  How to find the LinkedIn job URL?
                </summary>
                <div className="mt-4 pl-6 text-sm text-gray-600 space-y-2">
                  <p>1. Go to LinkedIn and find a job you're interested in</p>
                  <p>2. Click on the job to view its full details</p>
                  <p>3. Copy the URL from your browser's address bar</p>
                  <p className="text-xs text-gray-500 mt-3 bg-gray-50 p-3 rounded-lg font-mono">
                    Example: https://www.linkedin.com/jobs/view/1234567890
                  </p>
                </div>
              </details>
            </div>
          </form>
        ) : showCoverLetterGenerator ? (
          /* Cover Letter Generator */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 animate-fade-in">
            <CoverLetterGenerator
              jobId={job.job_id}
              companyName={job.company_name}
              jobTitle={job.title}
              jobLocation={job.location}
              jobUrl={job.linkedin_url}
              onBack={handleBackToJobDetails}
              showBackButton={true}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Loading enrichment indicator */}
            {isEnriching && (
              <div className="mb-6 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 px-4 py-3 rounded-r-lg flex items-start gap-3">
                <svg className="w-5 h-5 animate-spin flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
                </svg>
                <span className="font-medium">Enriching job details...</span>
              </div>
            )}

            {/* Success indicator */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 border-2 border-green-500 rounded-full text-green-700 font-semibold animate-scale-in">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Job Loaded Successfully!
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
              <JobDetails
                job={job}
                onStartOver={handleStartOver}
                showStartOverButton={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LinkedInUrlPage

