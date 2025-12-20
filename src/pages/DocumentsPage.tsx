import { useState, useEffect } from 'react'
import { documentsService } from '@/services/documentsService'
import type { DocumentStatus } from '@/types/api'

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
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Document Management</h1>
        <p className="text-lg text-gray-600">Manage your personal documents for cover letter generation</p>
      </div>

      {/* Current Status Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
            📁
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Current Status</h2>
        </div>
        {status?.has_uploaded_document ? (
          <div className="flex items-start gap-4 p-5 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-green-900 mb-1">Documents Uploaded</div>
              {status.last_upload_date && (
                <div className="text-sm text-green-700">
                  Last uploaded: {new Date(status.last_upload_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-amber-900 mb-1">No Documents Uploaded</div>
              <div className="text-sm text-amber-700">
                Upload documents to enable cover letter generation
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">
            📤
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Additional Documents</h2>
            <p className="text-sm text-gray-600 mt-1">
              Add more documents (resume, certificates, reference letters) to enhance your cover letters
            </p>
          </div>
        </div>

        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
        
        <label 
          htmlFor="file-upload" 
          className="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-indigo-400 transition-all duration-200"
        >
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p className="text-base text-gray-700 mb-2">
              <strong className="font-semibold">Click to upload</strong> or drag and drop
            </p>
            <p className="text-sm text-gray-500">PDF files only (max 5MB each)</p>
          </div>
        </label>

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="space-y-3 mb-6">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-3xl">📄</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    disabled={isUploading}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Delete Section - Danger Zone */}
      {status?.has_uploaded_document && (
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
              🗑️
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-900">Danger Zone</h2>
              <p className="text-sm text-red-700 mt-1">
                Permanently delete all your uploaded documents. This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={handleDeleteData}
            disabled={isDeleting}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {isDeleting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete All Documents'
            )}
          </button>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span className="text-green-800 font-medium">{success}</span>
          </div>
        </div>
      )}
    </div>
  )
}
