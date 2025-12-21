import { useState, useEffect } from 'react'
import JobDetails from '@/components/JobDetails'
import { jobsService } from '@/services/jobsService'
import type { JobListing } from '@/types/api'

const JobDescriptionPage = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [createdJob, setCreatedJob] = useState<JobListing | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldStates, setFieldStates] = useState({
    jobTitle: false,
    companyName: false,
    jobUrl: false,
    jobDescription: false,
  })

  // Track field completion for visual feedback
  useEffect(() => {
    setFieldStates({
      jobTitle: jobTitle.trim().length > 0,
      companyName: companyName.trim().length > 0,
      jobUrl: jobUrl.trim().length > 0,
      jobDescription: jobDescription.trim().length > 0,
    })
  }, [jobTitle, companyName, jobUrl, jobDescription])

  // Calculate progress
  const completedFields = Object.values(fieldStates).filter(Boolean).length
  const totalFields = Object.keys(fieldStates).length
  const progress = (completedFields / totalFields) * 100

  // Validate URL format
  const isValidUrl = (url: string) => {
    if (!url) return true // Empty is okay (not filled yet)
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const urlValid = isValidUrl(jobUrl)

  const handleAddJob = async () => {
    if (!jobDescription.trim() || !jobTitle.trim() || !companyName.trim() || !jobUrl.trim()) {
      setError('Please fill in all required fields')
      return
    }
    
    if (!urlValid) {
      setError('Please enter a valid URL')
      return
    }
    
    setError(null)

    setIsSubmitting(true)
    try {
      const newJob = await jobsService.createJobListing({
        title: jobTitle.trim(),
        company_name: companyName.trim(),
        linkedin_url: jobUrl.trim(),
        description: jobDescription.trim(),
      })
      setCreatedJob(newJob)
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'Failed to add job. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setJobDescription('')
    setJobTitle('')
    setCompanyName('')
    setJobUrl('')
    setError(null)
    setCreatedJob(null)
  }

  // Keyboard shortcut to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (jobDescription.trim() && jobTitle.trim() && companyName.trim() && jobUrl.trim() && !isSubmitting) {
          handleAddJob()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [jobDescription, jobTitle, companyName, jobUrl, isSubmitting])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Generate from Job Description
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Paste or type a job description to create your perfect cover letter and resume
          </p>
          
          {/* Decorative element */}
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {!createdJob ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 animate-scale-in">
            {/* Progress Indicator */}
            {completedFields > 0 && completedFields < totalFields && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {completedFields} of {totalFields} fields completed
                  </span>
                  <span className="text-sm font-semibold text-indigo-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Job Title & Company Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Job Title */}
              <div>
                <label htmlFor="job-title" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <span className="text-indigo-600 text-lg">💼</span>
                  Job Title
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="job-title"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 ${
                      fieldStates.jobTitle
                        ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50/30'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    }`}
                    placeholder="e.g. Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  {fieldStates.jobTitle && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="company-name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <span className="text-indigo-600 text-lg">🏢</span>
                  Company Name
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="company-name"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 ${
                      fieldStates.companyName
                        ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50/30'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                    }`}
                    placeholder="e.g. Tech Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  {fieldStates.companyName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Job URL */}
            <div className="mb-8">
              <label htmlFor="job-url" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <span className="text-indigo-600 text-lg">🔗</span>
                Job URL
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="job-url"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 ${
                    !urlValid && jobUrl.trim()
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/30'
                      : fieldStates.jobUrl && urlValid
                      ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50/30'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  }`}
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
                {fieldStates.jobUrl && urlValid && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
                {!urlValid && jobUrl.trim() && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                )}
              </div>
              {!urlValid && jobUrl.trim() && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Please enter a valid URL
                </p>
              )}
            </div>

            {/* Job Description */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="job-description" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="text-indigo-600 text-lg">📝</span>
                  Job Description
                  <span className="text-red-500">*</span>
                </label>
                {jobDescription.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {jobDescription.length} characters
                  </span>
                )}
              </div>
              <div className="relative">
                <textarea
                  id="job-description"
                  className={`w-full min-h-[400px] px-4 py-3 border-2 rounded-xl text-base text-gray-900 placeholder:text-gray-400 outline-none resize-y transition-all duration-200 ${
                    fieldStates.jobDescription
                      ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50/30'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                  }`}
                  placeholder="Paste the full job description here...

Example:
We're looking for a talented Software Engineer to join our team. You'll work on building scalable web applications and APIs...

Requirements:
• 3+ years of experience with React
• Strong knowledge of TypeScript
• Experience with Node.js
..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                {fieldStates.jobDescription && (
                  <div className="absolute right-3 top-3">
                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Include all relevant details like requirements, responsibilities, and qualifications for better results
              </p>
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
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center gap-3 relative overflow-hidden group"
              onClick={handleAddJob}
              disabled={
                !jobDescription.trim() ||
                !jobTitle.trim() ||
                !companyName.trim() ||
                !jobUrl.trim() ||
                !urlValid ||
                isSubmitting
              }
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {isSubmitting ? (
                <>
                  <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
                  </svg>
                  <span>Adding Job...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <span>Add Job</span>
                  <span className="hidden sm:inline text-sm opacity-75">(⌘↵)</span>
                </>
              )}
            </button>

            {/* Helper Text */}
            <p className="text-center text-sm text-gray-500 mt-4">
              After adding the job, you'll be able to generate tailored cover letters and resumes
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 animate-fade-in">
            {/* Success indicator */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 border-2 border-green-500 rounded-full text-green-700 font-semibold">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Job Added Successfully!
              </div>
            </div>

            <JobDetails
              job={createdJob}
              onStartOver={handleReset}
              showStartOverButton
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDescriptionPage

