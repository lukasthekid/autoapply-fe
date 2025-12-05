import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import type { 
  JobSearchRequest,
  ProfileSearchRequest,
  JobSearchResponse,
  JobListing,
  CreateJobFromUrlRequest,
  CreateCoverLetterRequest,
  CreateCoverLetterSimpleRequest,
  CoverLetterResponse
} from '@/types/api'

/**
 * Service for job-related API operations
 */
export const jobsService = {
  /**
   * Search for jobs on LinkedIn using saved search profiles
   * This endpoint automatically uses all user's search profiles
   */
  async searchJobsWithProfiles(data: ProfileSearchRequest): Promise<JobSearchResponse> {
    const response = await apiClient.post<JobSearchResponse>(
      '/api/jobs/search',
      data
    )
    return response.data
  },

  /**
   * Search for jobs on LinkedIn (legacy method - kept for backward compatibility)
   * @deprecated Use searchJobsWithProfiles instead
   */
  async searchJobs(data: JobSearchRequest): Promise<JobSearchResponse> {
    const response = await apiClient.post<JobSearchResponse>(
      '/api/jobs/search',
      data
    )
    return response.data
  },

  /**
   * Get job listings from database
   */
  async getJobListings(params?: {
    keyword?: string
    location?: string
    limit?: number
    offset?: number
  }): Promise<JobListing[]> {
    const response = await apiClient.get<JobListing[]>('/api/jobs/listings', {
      params,
    })
    return response.data
  },

  /**
   * Get a specific job listing by ID
   */
  async getJobById(jobId: string): Promise<JobListing> {
    const response = await apiClient.get<JobListing>(
      `/api/jobs/listings/${jobId}`
    )
    return response.data
  },

  /**
   * Get recent job search history
   */
  async getSearchHistory(limit: number = 10): Promise<any[]> {
    const response = await apiClient.get<any[]>('/api/jobs/search-history', {
      params: { limit },
    })
    return response.data
  },

  /**
   * Create a job listing from a LinkedIn URL
   */
  async createJobFromUrl(data: CreateJobFromUrlRequest): Promise<JobListing> {
    const response = await apiClient.post<JobListing>(
      '/api/jobs/create-from-url',
      data
    )
    return response.data
  },

  /**
   * Enrich job details by fetching from LinkedIn
   */
  async enrichJobDetails(jobId: string): Promise<JobListing> {
    const response = await apiClient.post<JobListing>(
      `/api/jobs/enrich/${jobId}`
    )
    return response.data
  },

  /**
   * Generate a cover letter for a job
   */
  async createCoverLetter(data: CreateCoverLetterRequest): Promise<CoverLetterResponse> {
    const response = await apiClient.post<CoverLetterResponse>(
      API_ENDPOINTS.COVER_LETTERS.CREATE_COVER_LETTER,
      data
    )
    return response.data
  },

  /**
   * Generate a cover letter using the simple endpoint (for manual job descriptions)
   */
  async createCoverLetterSimple(data: CreateCoverLetterSimpleRequest): Promise<CoverLetterResponse> {
    const response = await apiClient.post<CoverLetterResponse>(
      API_ENDPOINTS.COVER_LETTERS.CREATE_COVER_LETTER_SIMPLE,
      data
    )
    return response.data
  },
}

