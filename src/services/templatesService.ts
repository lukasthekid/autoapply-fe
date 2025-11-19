import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import type { TypstTemplateListResponse, ConvertToPdfRequest, ConvertToPdfResponse } from '@/types/api'

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

  /**
   * Convert cover letter text to PDF using a template
   * Requires authentication
   */
  async convertToPdf(data: ConvertToPdfRequest): Promise<ConvertToPdfResponse> {
    const response = await apiClient.post<ConvertToPdfResponse>(
      API_ENDPOINTS.TEMPLATES.CONVERT_TO_PDF,
      data
    )
    return response.data
  },
}

