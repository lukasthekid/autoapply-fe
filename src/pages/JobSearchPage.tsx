import { useState, useEffect, FormEvent, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { jobsService } from '@/services/jobsService'
import { applicationsService } from '@/services/applicationsService'
import { searchProfilesService } from '@/services/searchProfilesService'
import CoverLetterGenerator from '@/components/CoverLetterGenerator'
import JobDetails from '@/components/JobDetails'
import type { 
  ProfileSearchRequest, 
  JobListing, 
  DatePosted,
  JobApplication,
  SearchProfile
} from '@/types/api'

const JobCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
        <span className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
        <span className="h-6 w-28 bg-gray-200 rounded-full animate-pulse" />
        <span className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  )
}

const JobDetailsSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
            <div className="space-y-3">
              <div className="h-7 bg-gray-200 rounded-lg w-64 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded-lg w-56 animate-pulse" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-11 w-32 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-11 w-32 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse" />

        <div className="h-6 bg-gray-200 rounded-lg w-56 animate-pulse mt-6" />
        <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-lg w-2/3 animate-pulse" />
      </div>
    </div>
  )
}

const JobSearchPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useState<ProfileSearchRequest>({
    date_posted: 'past_24_hours',
    limit: 25,
  })
  
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileView, setMobileView] = useState<'list' | 'details'>('list')
  const jobDetailsRef = useRef<HTMLDivElement | null>(null)
  
  // Cover letter generation state
  const [showCoverLetterGenerator, setShowCoverLetterGenerator] = useState(false)
  
  // Track which jobs the user has already applied to
  const [userApplications, setUserApplications] = useState<JobApplication[]>([])
  
  // Search profiles state
  const [searchProfiles, setSearchProfiles] = useState<SearchProfile[]>([])
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setSearchParams(prev => ({ 
      ...prev, 
      [name]: name === 'limit' ? parseInt(value, 10) : value 
    }))
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setShowCoverLetterGenerator(false)
    setMobileView('list')
    
    if (searchProfiles.length === 0) {
      setError('Please create at least one search profile in Settings before searching for jobs.')
      return
    }

    setIsSearching(true)
    setIsLoadingResults(true)
    setHasSearched(true)
    setSelectedJob(null) // Clear selected job when searching

    try {
      const response = await jobsService.searchJobsWithProfiles(searchParams)
      setJobs(response.jobs)
      setTotalResults(response.total_results)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to search jobs'
      setError(errorMessage)
      setJobs([])
      setTotalResults(0)
    } finally {
      setIsSearching(false)
      // Keep skeleton loading state visible for a short time
      setTimeout(() => {
        setIsLoadingResults(false)
      }, 2000)
    }
  }

  const handleViewJob = (job: JobListing) => {
    // Jobs are already enriched, so we can show them directly
    setSelectedJob(job)
    setShowCoverLetterGenerator(false) // Reset cover letter view

    if (isMobile) {
      setMobileView('details')
      requestAnimationFrame(() => {
        jobDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  const handleBackToJobDetails = () => {
    setShowCoverLetterGenerator(false)
    if (isMobile) {
      setMobileView('details')
    }
  }

  const handleBackToList = () => {
    setShowCoverLetterGenerator(false)
    setMobileView('list')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Fetch search profiles and user applications when component mounts
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 900)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    const fetchData = async () => {
      try {
        const [profilesResponse, applicationsResponse] = await Promise.all([
          searchProfilesService.getAllSearchProfiles(),
          applicationsService.getAllApplications().catch(() => ({ applications: [] })),
        ])
        setSearchProfiles(profilesResponse.profiles)
        setUserApplications(applicationsResponse.applications || [])
      } catch (err) {
        console.warn('Failed to fetch data:', err)
        setSearchProfiles([])
        setUserApplications([])
      } finally {
        setIsLoadingProfiles(false)
      }
    }

    fetchData()
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setMobileView('list')
    }
  }, [isMobile])

  // Restore job and search state from navigation state (when returning from cover letter page)
  useEffect(() => {
    const state = location.state as { 
      selectedJob?: JobListing
      restoreJob?: boolean
      searchState?: {
        jobs?: JobListing[]
        searchParams?: ProfileSearchRequest
        hasSearched?: boolean
        totalResults?: number
      }
    } | null
    
    if (state?.restoreJob) {
      // Restore search state if available
      if (state.searchState) {
        if (state.searchState.jobs && state.searchState.jobs.length > 0) {
          setJobs(state.searchState.jobs)
        }
        if (state.searchState.searchParams) {
          setSearchParams(state.searchState.searchParams)
        }
        if (state.searchState.hasSearched !== undefined) {
          setHasSearched(state.searchState.hasSearched)
        }
        if (state.searchState.totalResults !== undefined) {
          setTotalResults(state.searchState.totalResults)
        }
      }
      
      // Restore selected job
      if (state.selectedJob) {
        // If we have jobs loaded (either from state or already loaded), try to find the job in the list
        const currentJobs = state.searchState?.jobs || jobs
        if (currentJobs.length > 0) {
          const foundJob = currentJobs.find(j => j.job_id === state.selectedJob?.job_id)
          if (foundJob) {
            setSelectedJob(foundJob)
          } else {
            // If job not in current list, add it to the list and select it
            setSelectedJob(state.selectedJob)
            if (state.searchState?.jobs) {
              setJobs([...state.searchState.jobs, state.selectedJob])
            } else {
              setJobs(prev => [...prev, state.selectedJob!])
            }
          }
        } else {
          // If no jobs loaded yet, set the job directly and mark as searched
          setSelectedJob(state.selectedJob)
          setHasSearched(true)
        }
        setMobileView('details')
      }
      
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Auto-select first job when jobs are loaded and no job is currently selected
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob && hasSearched && !isSearching && !isMobile) {
      // Check if we're restoring a job first
      const state = location.state as { restoreJob?: boolean } | null
      if (!state?.restoreJob) {
        setSelectedJob(jobs[0])
      }
    }
  }, [jobs, selectedJob, hasSearched, isSearching, location.state, isMobile])

  // Helper function to check if a job has been applied to
  const hasApplied = (job: JobListing): boolean => {
    return userApplications.some(
      (application) =>
        application.job_title === job.title &&
        application.company_name === job.company_name
    )
  }

  const datePostedOptions: { value: DatePosted; label: string }[] = [
    { value: 'any_time', label: 'Any time' },
    { value: 'past_24_hours', label: 'Past 24 hours' },
    { value: 'past_week', label: 'Past week' },
    { value: 'past_month', label: 'Past month' },
  ]

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Find Your Next Opportunity</h1>
        <p className="text-lg text-gray-600">Search thousands of jobs using your saved search profiles</p>
      </div>

      {isLoadingProfiles ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your search profiles...</p>
        </div>
      ) : searchProfiles.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
              ⚠️
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">No Search Profiles Found</h3>
              <p className="text-amber-800 mb-4 leading-relaxed">
                You need to create at least one search profile in Settings before you can search for jobs. 
                Your search profiles define the keywords, locations, job types, and experience levels for your searches.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => navigate('/settings')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                </svg>
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Search Profiles Notice */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">
                ℹ️
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-indigo-900 mb-1">Searching with Your Profiles</h3>
                <p className="text-sm text-indigo-800 mb-2">
                  Jobs will be searched using all your active search profiles from Settings.
                </p>
                <a 
                  href="/settings" 
                  className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                  </svg>
                  Manage search profiles
                </a>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-end gap-4 max-md:flex-col max-md:items-stretch">
                {/* Date Posted Filter */}
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2" htmlFor="date_posted">
                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Date Posted
                  </label>
                  <select
                    id="date_posted"
                    name="date_posted"
                    value={searchParams.date_posted || 'any_time'}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    {datePostedOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Results Limit Filter */}
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2" htmlFor="limit">
                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="9" x2="20" y2="9"></line>
                      <line x1="4" y1="15" x2="20" y2="15"></line>
                      <line x1="10" y1="3" x2="8" y2="21"></line>
                      <line x1="16" y1="3" x2="14" y2="21"></line>
                    </svg>
                    Results Limit
                  </label>
                  <select
                    id="limit"
                    name="limit"
                    value={searchParams.limit || 25}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                {/* Search Button */}
                <div className="flex-1">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isSearching}
                    title={isSearching ? 'Searching...' : 'Search Jobs'}
                  >
                    {isSearching ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Searching</span>
                      </>
                    ) : (
                      <>
                        <svg 
                          className="w-5 h-5"
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <span>Search Jobs</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
            <button 
              className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors flex-shrink-0"
              onClick={() => {
                setError(null)
                setHasSearched(false)
                setJobs([])
                setSelectedJob(null)
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]'}`}>
          {/* Jobs List Sidebar */}
          <div className={`${isMobile && mobileView === 'details' ? 'hidden' : 'block'}`}>
            {/* Results Header */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {isLoadingResults
                    ? 'Loading jobs...'
                    : jobs.length > 0
                      ? `${totalResults.toLocaleString()} jobs found`
                      : 'No jobs found'}
                </h2>
              </div>
              {!isLoadingResults && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Showing {jobs.length} results</p>
                  {isMobile && selectedJob && (
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      onClick={() => setMobileView('details')}
                    >
                      View details
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Active Filters */}
            {!isLoadingResults && jobs.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{datePostedOptions.find(o => o.value === searchParams.date_posted)?.label || 'Any time'}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="9" x2="20" y2="9"></line>
                    <line x1="4" y1="15" x2="20" y2="15"></line>
                    <line x1="10" y1="3" x2="8" y2="21"></line>
                    <line x1="16" y1="3" x2="14" y2="21"></line>
                  </svg>
                  <span>Limit: {searchParams.limit || 25}</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoadingResults && jobs.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No jobs match these filters
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Try adjusting your search criteria or date range
                </p>
                <button
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSearchParams({
                      date_posted: 'past_24_hours',
                      limit: 25,
                    })
                    setHasSearched(false)
                    setJobs([])
                    setSelectedJob(null)
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Jobs List */}
            <div className="space-y-3">
              {isLoadingResults
                ? Array.from({ length: 5 }).map((_, index) => (
                    <JobCardSkeleton key={index} />
                  ))
                : jobs.map(job => {
                    const jobHasApplied = hasApplied(job)
                    const isSelected = selectedJob?.job_id === job.job_id
                    
                    return (
                      <div 
                        key={job.job_id} 
                        className={`
                          bg-white rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 shadow-sm
                          ${isSelected 
                            ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                            : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                          }
                          ${jobHasApplied ? 'opacity-75' : ''}
                        `}
                        onClick={() => handleViewJob(job)}
                      >
                        {/* Job Header */}
                        <div className="flex gap-4 mb-4">
                          {job.company_logo_url && (
                            <img
                              src={job.company_logo_url}
                              alt={`${job.company_name} logo`}
                              className="w-12 h-12 rounded-lg object-contain flex-shrink-0 bg-gray-50 border border-gray-200"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
                              {jobHasApplied && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0" title="You have already applied to this job">
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                  Applied
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">{job.company_name}</p>
                          </div>
                        </div>
                        
                        {/* Job Meta */}
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            {job.location}
                          </span>
                          {job.applicants_count && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                              {job.applicants_count}
                            </span>
                          )}
                        </div>
                        
                        {/* Job Tags */}
                        <div className="flex gap-2 flex-wrap">
                          {job.employment_type && (
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                              {job.employment_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                          )}
                          {job.experience_level && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                              {job.experience_level.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
            </div>
          </div>

          {/* Job Details Panel */}
          <div
            ref={jobDetailsRef}
            className={`${isMobile ? (mobileView === 'details' ? 'block' : 'hidden') : 'block'}`}
          >
            {isMobile && (
              <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 p-4 sticky top-0 z-10 shadow-sm">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                  onClick={handleBackToList}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to results
                </button>
                {selectedJob && (
                  <div className="mt-3">
                    <span className="block text-base font-semibold text-gray-900 line-clamp-1">{selectedJob.title}</span>
                    <span className="block text-sm text-gray-600 line-clamp-1">{selectedJob.company_name}</span>
                  </div>
                )}
              </div>
            )}
            {isLoadingResults ? (
              <JobDetailsSkeleton />
            ) : !selectedJob ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a job to view details</h3>
                <p className="text-gray-600">Click on any job card to see the full description and details</p>
              </div>
            ) : showCoverLetterGenerator ? (
              <CoverLetterGenerator
                jobId={selectedJob.job_id}
                companyName={selectedJob.company_name}
                jobTitle={selectedJob.title}
                jobLocation={selectedJob.location}
                jobUrl={selectedJob.linkedin_url}
                onBack={handleBackToJobDetails}
                showBackButton={true}
              />
            ) : (
              <JobDetails
                job={selectedJob}
                isLoadingJobDetails={false}
                jobDetailError={null}
                searchState={{
                  jobs: jobs,
                  searchParams: searchParams,
                  hasSearched: hasSearched,
                  totalResults: totalResults,
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default JobSearchPage

