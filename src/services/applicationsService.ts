import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import type { CreateJobApplicationRequest, CreateJobApplicationResponse, JobApplicationListResponse, JobApplication, CheckApplicationResponse } from '@/types/api'

/**
 * Service for job application-related API operations
 */
export const applicationsService = {
  /**
   * Create a new job application
   * Requires authentication
   */
  async createApplication(data: CreateJobApplicationRequest): Promise<CreateJobApplicationResponse> {
    const response = await apiClient.post<CreateJobApplicationResponse>(
      API_ENDPOINTS.APPLICATIONS.CREATE,
      data
    )
    return response.data
  },

  /**
   * Get all job applications for the authenticated user
   * Requires authentication
   */
  async getAllApplications(): Promise<JobApplicationListResponse> {
    const response = await apiClient.get<JobApplicationListResponse>(
      API_ENDPOINTS.APPLICATIONS.LIST
    )
    return response.data
  },

  /**
   * Get a specific job application by ID
   * Requires authentication
   */
  async getApplicationById(id: number): Promise<JobApplication> {
    const response = await apiClient.get<JobApplication>(
      API_ENDPOINTS.APPLICATIONS.GET(id)
    )
    return response.data
  },

  /**
   * Check if user has already applied to a job
   * Checks in priority order: job_id → job_url → job_title + company_name
   * Requires authentication
   */
  async checkApplication(params: {
    job_id?: string
    job_url?: string
    job_title?: string
    company_name?: string
  }): Promise<CheckApplicationResponse> {
    const response = await apiClient.get<CheckApplicationResponse>(
      API_ENDPOINTS.APPLICATIONS.CHECK,
      { params }
    )
    return response.data
  },
}

