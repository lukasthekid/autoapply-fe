import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { JobListing } from '@/types/api'
import GenerateDocumentModal from './GenerateDocumentModal'
import { applicationsService } from '@/services/applicationsService'
import { useAuth } from '@/contexts/AuthContext'

interface JobDetailsProps {
  job: JobListing
  isLoadingJobDetails?: boolean
  jobDetailError?: string | null
  onStartOver?: () => void
  showStartOverButton?: boolean
  // Optional: Pass search state for restoration when navigating back
  searchState?: {
    jobs?: any[]
    searchParams?: any
    hasSearched?: boolean
    totalResults?: number
  }
}

const JobDetails = ({
  job,
  isLoadingJobDetails = false,
  jobDetailError = null,
  onStartOver,
  showStartOverButton = false,
  searchState,
}: JobDetailsProps) => {
  const navigate = useNavigate()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const [showViewMore, setShowViewMore] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const [hasApplied, setHasApplied] = useState<boolean | null>(null)
  const [isCheckingApplication, setIsCheckingApplication] = useState(false)
  const [isAddingApplication, setIsAddingApplication] = useState(false)
  const [applicationError, setApplicationError] = useState<string | null>(null)

  // Format employment type and experience level for display
  const formatText = (text: string | null | undefined) => {
    if (!text) return null
    return text.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // Check if description is long enough to need "View more"
  useEffect(() => {
    setIsDescriptionExpanded(false) // Reset when job changes
    if (descriptionRef.current && job.description) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (descriptionRef.current) {
          const height = descriptionRef.current.scrollHeight
          setShowViewMore(height > 400) // Show "View more" if content is taller than 400px
        }
      }, 0)
    }
  }, [job.job_id, job.description])

  // Check if user has already applied to this job
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!isAuthenticated) {
        setHasApplied(null)
        return
      }

      setIsCheckingApplication(true)
      setApplicationError(null)
      try {
        const response = await applicationsService.checkApplication({
          job_id: job.job_id,
          job_url: job.linkedin_url,
          job_title: job.title,
          company_name: job.company_name,
        })
        setHasApplied(response.has_applied)
      } catch (error: any) {
        console.error('Error checking application status:', error)
        // Don't show error to user, just assume not applied
        setHasApplied(false)
      } finally {
        setIsCheckingApplication(false)
      }
    }

    checkApplicationStatus()
  }, [isAuthenticated, job.job_id, job.linkedin_url, job.title, job.company_name])

  const handleGenerateClick = () => {
    setIsModalOpen(true)
  }

  const handleSelectCoverLetter = () => {
    // Navigate to cover letter page with job details and return path
    const returnPath = window.location.pathname // Current page path
    navigate('/cover-letter', {
      state: {
        jobId: job.job_id,
        companyName: job.company_name,
        jobTitle: job.title,
        jobLocation: job.location,
        jobUrl: job.linkedin_url,
        returnPath: returnPath,
        job: job, // Pass full job object for restoration
        searchState: searchState, // Pass search state for restoration
      }
    })
  }

  const handleSelectResume = () => {
    // Navigate to resume page with job details and return path
    const returnPath = window.location.pathname // Current page path
    navigate('/resume', {
      state: {
        jobId: job.job_id,
        companyName: job.company_name,
        jobTitle: job.title,
        jobLocation: job.location,
        jobUrl: job.linkedin_url,
        jobDescription: job.description || '', // Pass job description for resume generation
        returnPath: returnPath,
        job: job, // Pass full job object for restoration
        searchState: searchState, // Pass search state for restoration
      }
    })
  }

  const handleApplyClick = async () => {
    const goToJobPage = () => {
      if (job.linkedin_url) {
        window.open(job.linkedin_url, '_blank', 'noopener,noreferrer')
      }
    }

    // Always allow navigation for unauthenticated users
    if (!isAuthenticated) {
      goToJobPage()
      return
    }

    // If we've already added it, just navigate
    if (hasApplied) {
      goToJobPage()
      return
    }

    setIsAddingApplication(true)
    setApplicationError(null)
    try {
      await applicationsService.createApplication({
        job_id: job.job_id || null,
        job_title: job.title,
        company_name: job.company_name,
        job_location: job.location || null,
        job_url: job.linkedin_url || null,
        notes: null,
      })
      setHasApplied(true)
    } catch (error: any) {
      console.error('Error adding application:', error)
      setApplicationError(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to add application. Please try again.'
      )
    } finally {
      setIsAddingApplication(false)
      goToJobPage()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-8">
        {/* Error Messages */}
        {jobDetailError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span className="text-red-800">{jobDetailError}</span>
          </div>
        )}
        
        {applicationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span className="text-red-800">{applicationError}</span>
          </div>
        )}
        
        {/* Job Summary Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-6 mb-6 max-md:flex-col">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{job.title}</h2>
              <p className="text-xl font-semibold text-gray-700 mb-4">
                {job.company_name}
              </p>
              
              {/* Key tags and meta */}
              <div className="flex flex-wrap gap-3 items-center">
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {job.location}
                </span>
                {job.employment_type && (
                  <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                    {formatText(job.employment_type)}
                  </span>
                )}
                {job.experience_level && (
                  <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                    {formatText(job.experience_level)}
                  </span>
                )}
                {job.applicants_count && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-600">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {job.applicants_count} applicants
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0 max-md:w-full max-md:justify-end">
              {isAuthenticated && hasApplied === true && (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg text-sm opacity-75">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Added
                </span>
              )}
              <button
                onClick={handleApplyClick}
                disabled={isAddingApplication || isCheckingApplication}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingApplication ? 'Applying...' : 'Apply on LinkedIn'}
              </button>
              <button 
                className="relative group p-2.5 bg-gradient-to-br from-indigo-600 via-teal-500 to-amber-500 rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                onClick={handleGenerateClick}
                title="Generate cover letter or resume"
              >
                <svg 
                  viewBox="0 0 56 56" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 relative z-10"
                >
                  <path 
                    d="M 26.6875 12.6602 C 26.9687 12.6602 27.1094 12.4961 27.1797 12.2383 C 27.9062 8.3242 27.8594 8.2305 31.9375 7.4570 C 32.2187 7.4102 32.3828 7.2461 32.3828 6.9648 C 32.3828 6.6836 32.2187 6.5195 31.9375 6.4726 C 27.8828 5.6524 28.0000 5.5586 27.1797 1.6914 C 27.1094 1.4336 26.9687 1.2695 26.6875 1.2695 C 26.4062 1.2695 26.2656 1.4336 26.1953 1.6914 C 25.3750 5.5586 25.5156 5.6524 21.4375 6.4726 C 21.1797 6.5195 20.9922 6.6836 20.9922 6.9648 C 20.9922 7.2461 21.1797 7.4102 21.4375 7.4570 C 25.5156 8.2774 25.4687 8.3242 26.1953 12.2383 C 26.2656 12.4961 26.4062 12.6602 26.6875 12.6602 Z M 15.3438 28.7852 C 15.7891 28.7852 16.0938 28.5039 16.1406 28.0821 C 16.9844 21.8242 17.1953 21.8242 23.6641 20.5821 C 24.0860 20.5117 24.3906 20.2305 24.3906 19.7852 C 24.3906 19.3633 24.0860 19.0586 23.6641 18.9883 C 17.1953 18.0977 16.9609 17.8867 16.1406 11.5117 C 16.0938 11.0899 15.7891 10.7852 15.3438 10.7852 C 14.9219 10.7852 14.6172 11.0899 14.5703 11.5352 C 13.7969 17.8164 13.4687 17.7930 7.0469 18.9883 C 6.6250 19.0821 6.3203 19.3633 6.3203 19.7852 C 6.3203 20.2539 6.6250 20.5117 7.1406 20.5821 C 13.5156 21.6133 13.7969 21.7774 14.5703 28.0352 C 14.6172 28.5039 14.9219 28.7852 15.3438 28.7852 Z M 31.2344 54.7305 C 31.8438 54.7305 32.2891 54.2852 32.4062 53.6524 C 34.0703 40.8086 35.8750 38.8633 48.5781 37.4570 C 49.2344 37.3867 49.6797 36.8945 49.6797 36.2852 C 49.6797 35.6758 49.2344 35.2070 48.5781 35.1133 C 35.8750 33.7070 34.0703 31.7617 32.4062 18.9180 C 32.2891 18.2852 31.8438 17.8633 31.2344 17.8633 C 30.6250 17.8633 30.1797 18.2852 30.0860 18.9180 C 28.4219 31.7617 26.5938 33.7070 13.9140 35.1133 C 13.2344 35.2070 12.7891 35.6758 12.7891 36.2852 C 12.7891 36.8945 13.2344 37.3867 13.9140 37.4570 C 26.5703 39.1211 28.3281 40.8321 30.0860 53.6524 C 30.1797 54.2852 30.6250 54.7305 31.2344 54.7305 Z" 
                    fill="white"
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-teal-500 to-amber-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
              </button>
              {showStartOverButton && onStartOver && (
                <button 
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  onClick={onStartOver}
                >
                  Try another URL
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoadingJobDetails && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Loading full job description...</p>
          </div>
        )}

        {/* Job Description */}
        {job.description && (
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
            <div 
              ref={descriptionRef}
              className={`prose prose-sm max-w-none text-gray-700 leading-relaxed transition-all duration-300 ${
                !isDescriptionExpanded && showViewMore ? 'max-h-[400px] overflow-hidden relative' : ''
              }`}
              dangerouslySetInnerHTML={{ 
                __html: (() => {
                  if (!job.description) return ''

                  // Escape any HTML just to be safe
                  const escapeHtml = (str: string) =>
                    str
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')

                  const normalized = job.description.replace(/\r\n/g, '\n')

                  // Treat the description as plain text:
                  // - Split into paragraphs on double (or more) newlines
                  // - Keep single line breaks inside a paragraph as <br /> so original
                  //   line structure is preserved, but paragraphs are clearly separated.
                  const paragraphs = normalized
                    .split(/\n{2,}/)
                    .map(block => {
                      const lines = block.split('\n')
                      const escapedLines = lines
                        .map(l => escapeHtml(l.trim()))
                        .filter(Boolean)
                      return escapedLines.join('<br /><br />')
                    })
                    .filter(Boolean)

                  return paragraphs.map(p => `<p>${p}</p>`).join('')
                })()
              }}
            />
            {/* Gradient fade overlay when collapsed */}
            {!isDescriptionExpanded && showViewMore && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
            {/* View More Button */}
            {showViewMore && (
              <button
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <span>{isDescriptionExpanded ? 'Show less' : 'View full description'}</span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${isDescriptionExpanded ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
      <GenerateDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCoverLetter={handleSelectCoverLetter}
        onSelectResume={handleSelectResume}
      />
    </div>
  )
}

export default JobDetails
