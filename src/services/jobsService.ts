import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import type { 
  JobSearchRequest,
  ProfileSearchRequest,
  JobSearchResponse,
  JobListing,
  CreateJobListingRequest,
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
   * Create a job listing manually
   */
  async createJobListing(data: CreateJobListingRequest): Promise<JobListing> {
    const response = await apiClient.post<JobListing>(
      '/api/jobs/listings',
      data
    )
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
    
    return Promise.resolve({
      cover_letter_text: "To the Hiring Team at Canonical,\n\nI am writing to express my enthusiastic interest in the Juju Software Engineer (Go) position at Canonical. With a strong academic background in Computer Science and Data Science from TU Wien, coupled with practical experience in developing scalable and distributed systems, I am confident in my ability to contribute meaningfully to your team and the Juju project.\n\nMy experience with Docker and Kubernetes, alongside developing robust backend architectures and managing complex data infrastructures, aligns well with the demands of building and maintaining a highly concurrent, distributed system like Juju. I have a proven track record in software engineering, including designing and developing mission-critical backend systems using Java Spring Boot microservices at CHECK24, and building real-time train-tracking platforms with Node.js at IQSOFT. While my primary professional language has been Java and Python, I am a quick and eager learner, ready to immerse myself in Go development. My academic coursework also included distributed systems, providing a solid theoretical foundation.\n\nI am particularly drawn to Canonical's commitment to open source and its globally distributed collaborative environment. Having worked on projects requiring seamless integration and user-centric design, and engaging in collaborative problem-solving, I am adept at working within diverse and remote teams. My excellent communication skills, both verbal and written, cultivated through academic presentations and professional collaboration, would allow me to interact effectively within upstream communities and with colleagues globally.\n\nThe opportunity to contribute to a project like Juju, which powers complex distributed software systems across various cloud environments and plays a critical role for many internal and external teams, is incredibly exciting. I am eager to leverage my problem-solving abilities and passion for efficient, scalable software to support Canonical's mission. I am also very willing to travel for internal events as required.\n\nThank you for considering my application. I look forward to the possibility of discussing how my skills and dedication can benefit Canonical.\n\nSincerely,\nLukas Burtscher",
      success: true,
    })
      
     /*
    const response = await apiClient.post<CoverLetterResponse>(
      API_ENDPOINTS.COVER_LETTERS.CREATE_COVER_LETTER,
      data
    )
    return response.data
    */
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

