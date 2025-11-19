import { useState, useEffect, FormEvent } from 'react'
import { jobsService } from '@/services/jobsService'
import { applicationsService } from '@/services/applicationsService'
import CoverLetterGenerator from '@/components/CoverLetterGenerator'
import JobDetails from '@/components/JobDetails'
import type { 
  JobSearchRequest, 
  JobListing, 
  JobType, 
  ExperienceLevel, 
  DatePosted,
  JobApplication
} from '@/types/api'
import './JobSearchPage.css'

const JobSearchPage = () => {
  const [searchParams, setSearchParams] = useState<JobSearchRequest>({
    keyword: '',
    location: '',
    job_types: null,
    experience_levels: null,
    date_posted: 'any_time',
    limit: 25,
  })
  
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)
  const [isLoadingJobDetails, setIsLoadingJobDetails] = useState(false)
  const [jobDetailError, setJobDetailError] = useState<string | null>(null)
  
  // Cover letter generation state
  const [showCoverLetterGenerator, setShowCoverLetterGenerator] = useState(false)
  
  // Track which jobs the user has already applied to
  const [userApplications, setUserApplications] = useState<JobApplication[]>([])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setSearchParams(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleMultiSelectChange = (
    name: 'job_types' | 'experience_levels',
    value: string
  ) => {
    setSearchParams(prev => {
      const currentValues = prev[name] || []
      const isSelected = currentValues.includes(value as any)
      
      if (isSelected) {
        // Remove from array
        const newValues = currentValues.filter(v => v !== value)
        return {
          ...prev,
          [name]: newValues.length > 0 ? newValues : null,
        }
      } else {
        // Add to array
        return {
          ...prev,
          [name]: [...currentValues, value] as any,
        }
      }
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!searchParams.keyword.trim() || !searchParams.location.trim()) {
      setError('Please enter both keyword and location')
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    setSelectedJob(null) // Clear selected job when searching

    try {
      const response = await jobsService.searchJobs(searchParams)
      setJobs(response.jobs)
      setTotalResults(response.total_results)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to search jobs'
      setError(errorMessage)
      setJobs([])
      setTotalResults(0)
    } finally {
      setIsSearching(false)
    }
  }

  const handleViewJob = async (job: JobListing) => {
    setIsLoadingJobDetails(true)
    setJobDetailError(null)
    setSelectedJob(job) // Set immediately with basic data
    setShowCoverLetterGenerator(false) // Reset cover letter view

    try {
      // Enrich job details from LinkedIn
      const enrichedJob = await jobsService.enrichJobDetails(job.job_id)
      setSelectedJob(enrichedJob)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to load job details'
      setJobDetailError(errorMessage)
      // Keep the basic job data even if enrichment fails
    } finally {
      setIsLoadingJobDetails(false)
    }
  }

  const handleGenerateCoverLetter = () => {
    setShowCoverLetterGenerator(true)
  }

  const handleBackToJobDetails = () => {
    setShowCoverLetterGenerator(false)
  }

  // Fetch all user applications once when component mounts
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationsService.getAllApplications()
        setUserApplications(response.applications)
      } catch (err) {
        // Silently fail - don't block the UI if applications can't be loaded
        console.warn('Failed to fetch user applications:', err)
        setUserApplications([])
      }
    }

    fetchApplications()
  }, [])

  // Helper function to check if a job has been applied to
  const hasApplied = (job: JobListing): boolean => {
    return userApplications.some(
      (application) =>
        application.job_title === job.title &&
        application.company_name === job.company_name
    )
  }

  const jobTypes: { value: JobType; label: string }[] = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'part_time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' },
  ]

  const experienceLevels: { value: ExperienceLevel; label: string }[] = [
    { value: 'internship', label: 'Internship' },
    { value: 'entry_level', label: 'Entry Level' },
    { value: 'associate', label: 'Associate' },
    { value: 'mid_senior_level', label: 'Mid-Senior Level' },
    { value: 'director', label: 'Director' },
  ]

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
          <p>Search thousands of Jobs</p>
        </div>

        <form onSubmit={handleSubmit} className="job-search-form">
          <div className="search-main">
            {/* Job Title Input */}
            <div className="search-input-wrapper">
              <svg 
                className="input-icon"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <div className="input-content">
                <label htmlFor="keyword" className="input-label">Job Title</label>
                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={searchParams.keyword}
                  onChange={handleInputChange}
                  placeholder="Software Engineer, Data Scientist..."
                  className="search-input"
                  required
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="search-input-wrapper">
              <svg 
                className="input-icon"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div className="input-content">
                <label htmlFor="location" className="input-label">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={searchParams.location}
                  onChange={handleInputChange}
                  placeholder="Vienna, Austria..."
                  className="search-input"
                  required
                />
              </div>
            </div>

            {/* Search Button */}
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

          <details className="search-filters">
            <summary>🎯 Advanced Filters</summary>
            
            <div className="filters-content">
              <div className="filter-group">
                <label className="filter-label">💼 Job Type</label>
                <div className="pill-group">
                  {jobTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      className={`filter-pill ${searchParams.job_types?.includes(type.value) ? 'active' : ''}`}
                      onClick={() => handleMultiSelectChange('job_types', type.value)}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">📊 Experience Level</label>
                <div className="pill-group">
                  {experienceLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      className={`filter-pill ${searchParams.experience_levels?.includes(level.value) ? 'active' : ''}`}
                      onClick={() => handleMultiSelectChange('experience_levels', level.value)}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label" htmlFor="date_posted">📅 Date Posted</label>
                  <div className="custom-select">
                    <select
                      id="date_posted"
                      name="date_posted"
                      value={searchParams.date_posted || 'any_time'}
                      onChange={handleInputChange}
                    >
                      {datePostedOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label" htmlFor="limit">🔢 Results Limit</label>
                  <div className="custom-select">
                    <select
                      id="limit"
                      name="limit"
                      value={searchParams.limit || 25}
                      onChange={handleInputChange}
                    >
                      <option value="10">10 results</option>
                      <option value="25">25 results</option>
                      <option value="50">50 results</option>
                      <option value="100">100 results</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </form>

        {error && (
          <div className="search-error">
            {error}
          </div>
        )}

        {hasSearched && !isSearching && (
          <div className="search-results-container">
            <div className="results-sidebar">
              <div className="results-header">
                <h2>
                  {jobs.length > 0
                    ? `${totalResults.toLocaleString()} jobs`
                    : 'No jobs found'}
                </h2>
                <p className="results-count">Showing {jobs.length}</p>
              </div>

              <div className="jobs-list">
                {jobs.map(job => {
                  const jobHasApplied = hasApplied(job)
                  
                  return (
                    <div 
                      key={job.job_id} 
                      className={`job-card-compact ${selectedJob?.job_id === job.job_id ? 'selected' : ''} ${isLoadingJobDetails && selectedJob?.job_id === job.job_id ? 'loading' : ''} ${jobHasApplied ? 'applied' : ''}`}
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

                      <div className="job-card-footer">
                        {isLoadingJobDetails && selectedJob?.job_id === job.job_id ? (
                          <span className="loading-text">
                            <div className="loading-spinner-tiny"></div>
                            Loading...
                          </span>
                        ) : (
                          <span className="view-text">
                            View Details →
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="job-details-panel">
              {!selectedJob ? (
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
                  isLoadingJobDetails={isLoadingJobDetails}
                  jobDetailError={jobDetailError}
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

