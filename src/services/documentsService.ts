import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import type { 
  PDFUploadRequest,
  UploadResponse,
  DocumentStatus,
  DeleteDataResponse
} from '@/types/api'

/**
 * Service for document-related API operations
 */
export const documentsService = {
  /**
   * Upload a PDF document (base64 encoded)
   */
  async uploadPDF(data: PDFUploadRequest): Promise<UploadResponse> {
    const response = await apiClient.post<UploadResponse>(
      API_ENDPOINTS.DOCUMENTS.UPLOAD_PDF,
      data
    )
    return response.data
  },

  /**
   * Get document upload status for current user
   */
  async getStatus(): Promise<DocumentStatus> {
    const response = await apiClient.get<DocumentStatus>(
      API_ENDPOINTS.DOCUMENTS.STATUS
    )
    return response.data
  },

  /**
   * Delete user's document data
   */
  async deleteData(): Promise<DeleteDataResponse> {
    const response = await apiClient.delete<DeleteDataResponse>(
      API_ENDPOINTS.DOCUMENTS.DELETE_DATA
    )
    return response.data
  },
}

