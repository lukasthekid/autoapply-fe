import { useState, useEffect } from 'react'
import { documentsService } from '@/services/documentsService'
import type { DocumentStatus } from '@/types/api'
import './DocumentsPage.css'

export default function DocumentsPage() {
  const [status, setStatus] = useState<DocumentStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      const data = await documentsService.getStatus()
      setStatus(data)
    } catch (err: any) {
      setError('Failed to load document status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length !== files.length) {
      setError('Only PDF files are allowed')
      return
    }

    const invalidFiles = pdfFiles.filter(file => file.size > 5 * 1024 * 1024)
    if (invalidFiles.length > 0) {
      setError('Files must be smaller than 5MB')
      return
    }

    setSelectedFiles(prev => [...prev, ...pdfFiles])
    setError(null)
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one PDF file')
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      for (const file of selectedFiles) {
        const base64 = await fileToBase64(file)
        await documentsService.uploadPDF({
          file_base64: base64,
          filename: file.name,
        })
      }

      setSuccess(`Successfully uploaded ${selectedFiles.length} document(s)`)
      setSelectedFiles([])
      await fetchStatus()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Upload failed'
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteData = async () => {
    if (!confirm('Are you sure you want to delete all your documents? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    setError(null)
    setSuccess(null)

    try {
      await documentsService.deleteData()
      setSuccess('All documents deleted successfully')
      await fetchStatus()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Delete failed'
      setError(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (isLoading) {
    return (
      <div className="documents-page">
        <div className="loading-state">Loading...</div>
      </div>
    )
  }

  return (
    <div className="documents-page">
      <div className="documents-container">
        <div className="page-header">
          <h1>Document Management</h1>
          <p>Manage your personal documents for cover letter generation</p>
        </div>

        {/* Current Status */}
        <div className="status-card">
          <h2>📁 Current Status</h2>
          {status?.has_uploaded_document ? (
            <div className="status-info success">
              <div className="status-icon">✓</div>
              <div>
                <div className="status-title">Documents Uploaded</div>
                {status.last_upload_date && (
                  <div className="status-subtitle">
                    Last uploaded: {new Date(status.last_upload_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="status-info warning">
              <div className="status-icon">⚠</div>
              <div>
                <div className="status-title">No Documents Uploaded</div>
                <div className="status-subtitle">
                  Upload documents to enable cover letter generation
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <h2>📤 Upload Additional Documents</h2>
          <p className="section-subtitle">
            Add more documents (resume, certificates, reference letters) to enhance your cover letters
          </p>

          <input
            type="file"
            id="file-upload"
            multiple
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
          
          <label htmlFor="file-upload" className="upload-dropzone">
            <div className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p className="upload-text">
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p className="upload-hint">PDF files only (max 5MB each)</p>
          </label>

          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h3>Selected Files ({selectedFiles.length})</h3>
              <div className="file-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-icon">📄</div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{formatFileSize(file.size)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="remove-btn"
                      disabled={isUploading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="upload-btn"
              >
                {isUploading ? (
                  <>
                    <span className="spinner"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Delete Section */}
        {status?.has_uploaded_document && (
          <div className="danger-zone">
            <h2>🗑️ Danger Zone</h2>
            <p className="section-subtitle">
              Permanently delete all your uploaded documents. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteData}
              disabled={isDeleting}
              className="delete-btn"
            >
              {isDeleting ? (
                <>
                  <span className="spinner"></span>
                  Deleting...
                </>
              ) : (
                'Delete All Documents'
              )}
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="message error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {success}
          </div>
        )}
      </div>
    </div>
  )
}

