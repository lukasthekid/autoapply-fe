import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import type { TypstTemplateListResponse } from '@/types/api'

export const templatesService = {
  /**
   * Get all Typst templates
   * Requires authentication
   */
  async getAllTemplates(): Promise<TypstTemplateListResponse> {
    const response = await apiClient.get<TypstTemplateListResponse>(
      API_ENDPOINTS.TEMPLATES.LIST
    )
    return response.data
  },
}

