import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
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
import './JobSearchPage.css'

const JobCardSkeleton = () => {
  return (
    <div className="job-card-compact skeleton-card">
      <div className="job-card-header">
        <div className="skeleton skeleton-logo-small" />
        <div className="job-title-company">
          <div className="skeleton skeleton-text skeleton-text-lg" />
          <div className="skeleton skeleton-text skeleton-text-md" />
          <div className="skeleton skeleton-text skeleton-text-sm" />
        </div>
      </div>

      <div className="job-meta">
        <span className="skeleton skeleton-pill" />
        <span className="skeleton skeleton-pill" />
        <span className="skeleton skeleton-pill" />
        <span className="skeleton skeleton-pill" />
      </div>
    </div>
  )
}

const JobDetailsSkeleton = () => {
  return (
    <div className="job-details-skeleton job-details-content">
      <div className="job-summary-block">
        <div className="job-summary-header">
          <div className="job-header-left">
            <div className="skeleton skeleton-logo-large" />
            <div>
              <div className="skeleton skeleton-text skeleton-title-line" />
              <div className="skeleton skeleton-text skeleton-title-line short" />
              <div className="skeleton skeleton-text skeleton-company-line" />
            </div>
          </div>
          <div className="job-summary-actions">
            <div className="skeleton skeleton-button" />
            <div className="skeleton skeleton-button" />
          </div>
        </div>

        <div className="job-summary-meta">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="job-summary-meta-item">
              <div className="skeleton skeleton-meta-label" />
              <div className="skeleton skeleton-meta-value" />
            </div>
          ))}
        </div>
      </div>

      <div className="job-description-full">
        <div className="skeleton skeleton-section-title" />
        <div className="skeleton skeleton-paragraph-line" />
        <div className="skeleton skeleton-paragraph-line" />
        <div className="skeleton skeleton-paragraph-line short" />

        <div className="skeleton skeleton-section-title section-spacing" />
        <div className="skeleton skeleton-paragraph-line" />
        <div className="skeleton skeleton-paragraph-line" />
        <div className="skeleton skeleton-paragraph-line short" />
      </div>
    </div>
  )
}

const JobSearchPage = () => {
  const navigate = useNavigate()
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
  }

  const handleGenerateCoverLetter = () => {
    setShowCoverLetterGenerator(true)
  }

  const handleBackToJobDetails = () => {
    setShowCoverLetterGenerator(false)
  }

  // Fetch search profiles and user applications when component mounts
  useEffect(() => {
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
  }, [])

  // Auto-select first job when jobs are loaded and no job is currently selected
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob && hasSearched && !isSearching) {
      setSelectedJob(jobs[0])
    }
  }, [jobs, selectedJob, hasSearched, isSearching])

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
    <div className="job-search-page">
      <div className="container">
        <div className="job-search-header">
          <h1>Find Your Next Opportunity</h1>
          <p>Search thousands of Jobs using your saved search profiles</p>
        </div>

        {isLoadingProfiles ? (
          <div className="search-profiles-loading">
            <div className="loading-spinner"></div>
            <p>Loading your search profiles...</p>
          </div>
        ) : searchProfiles.length === 0 ? (
          <div className="search-profiles-notice search-profiles-error">
            <div className="notice-icon">⚠️</div>
            <div className="notice-content">
              <h3>No Search Profiles Found</h3>
              <p>
                You need to create at least one search profile in Settings before you can search for jobs. 
                Your search profiles define the keywords, locations, job types, and experience levels for your searches.
              </p>
              <button
                type="button"
                className="btn-primary btn-small"
                onClick={() => navigate('/settings')}
                style={{ marginTop: '0.75rem' }}
              >
                Go to Settings
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="search-profiles-notice">
              <div className="notice-icon">ℹ️</div>
              <div className="notice-content">
                <h3>Searching with Your Profiles</h3>
                <a href="/settings">View your search profiles</a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="job-search-form">
              <div className="search-main">
                <div className="search-filters-simple">
                  <div className="filter-controls-compact">
                    <div className="custom-select compact-select">
                      <select
                        id="date_posted"
                        name="date_posted"
                        value={searchParams.date_posted || 'any_time'}
                        onChange={handleInputChange}
                        className="compact-select-input"
                      >
                        {datePostedOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="custom-select compact-select">
                      <select
                        id="limit"
                        name="limit"
                        value={searchParams.limit || 25}
                        onChange={handleInputChange}
                        className="compact-select-input"
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
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
              </div>
            </form>
          </>
        )}

        {error && (
          <div className="search-error">
            <span>{error}</span>
            <button 
              className="error-reset" 
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
        )}

        {hasSearched && (
          <div className="search-results-container">
            <div className="results-sidebar">
              <div className="results-header">
                <h2>
                  {isLoadingResults
                    ? 'Loading jobs...'
                    : jobs.length > 0
                      ? `${totalResults.toLocaleString()} jobs`
                      : 'No jobs found'}
                </h2>
                {!isLoadingResults && (
                  <p className="results-count">Showing {jobs.length}</p>
                )}
              </div>

              {!isLoadingResults && jobs.length > 0 && (
                <div className="active-filters">
                  <div className="filter-chip">
                    <span className="chip-label">Date:</span>
                    <span>{datePostedOptions.find(o => o.value === searchParams.date_posted)?.label || 'Any time'}</span>
                  </div>
                  <div className="filter-chip">
                    <span className="chip-label">Limit:</span>
                    <span>{searchParams.limit || 25}</span>
                  </div>
                </div>
              )}

              {!isLoadingResults && jobs.length === 0 && (
                <div className="no-jobs-empty" style={{ padding: '2rem 1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🔍</div>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
                    No jobs match these filters
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Try adjusting your search criteria or date range
                  </p>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSearchParams({
                        date_posted: 'past_24_hours',
                        limit: 25,
                      })
                      setHasSearched(false)
                      setJobs([])
                      setSelectedJob(null)
                    }}
                    style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              <div className="jobs-list">
                {isLoadingResults
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <JobCardSkeleton key={index} />
                    ))
                  : jobs.map(job => {
                      const jobHasApplied = hasApplied(job)
                      
                      return (
                        <div 
                          key={job.job_id} 
                          className={`job-card-compact ${selectedJob?.job_id === job.job_id ? 'selected' : ''} ${jobHasApplied ? 'applied' : ''}`}
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
                              <div className="job-title-row">
                                <h3>{job.title}</h3>
                                {jobHasApplied && (
                                  <span className="applied-badge" title="You have already applied to this job">
                                    ✓ Applied
                                  </span>
                                )}
                              </div>
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
                          
                          <div className="job-meta-tags">
                            {job.employment_type && (
                              <span className="job-tag">
                                {job.employment_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </span>
                            )}
                            {job.experience_level && (
                              <span className="job-tag">
                                {job.experience_level.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
              </div>
            </div>

            <div className="job-details-panel">
              {isLoadingResults ? (
                <JobDetailsSkeleton />
              ) : !selectedJob ? (
                <div className="no-job-selected">
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>Select a job to view details</h3>
                    <p>Click "View" on any job to see the full description and details</p>
                  </div>
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
                  onGenerateCoverLetter={handleGenerateCoverLetter}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobSearchPage

