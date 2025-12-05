import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import type {
  SearchProfile,
  CreateSearchProfileRequest,
  UpdateSearchProfileRequest,
  SearchProfileListResponse,
} from '@/types/api'

/**
 * Service for search profile-related API operations
 */
export const searchProfilesService = {
  /**
   * Get all search profiles for the authenticated user
   * Requires authentication
   */
  async getAllSearchProfiles(): Promise<SearchProfileListResponse> {
    const response = await apiClient.get<SearchProfileListResponse>(
      API_ENDPOINTS.SEARCH_PROFILES.LIST
    )
    return response.data
  },

  /**
   * Get a specific search profile by ID
   * Requires authentication
   */
  async getSearchProfileById(id: number): Promise<SearchProfile> {
    const response = await apiClient.get<SearchProfile>(
      API_ENDPOINTS.SEARCH_PROFILES.GET(id)
    )
    return response.data
  },

  /**
   * Create a new search profile
   * Requires authentication
   */
  async createSearchProfile(
    data: CreateSearchProfileRequest
  ): Promise<SearchProfile> {
    const response = await apiClient.post<SearchProfile>(
      API_ENDPOINTS.SEARCH_PROFILES.CREATE,
      data
    )
    return response.data
  },

  /**
   * Update an existing search profile
   * Requires authentication
   */
  async updateSearchProfile(
    id: number,
    data: UpdateSearchProfileRequest
  ): Promise<SearchProfile> {
    const response = await apiClient.put<SearchProfile>(
      API_ENDPOINTS.SEARCH_PROFILES.UPDATE(id),
      data
    )
    return response.data
  },

  /**
   * Delete a search profile
   * Requires authentication
   */
  async deleteSearchProfile(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SEARCH_PROFILES.DELETE(id))
  },
}
