import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { documentsService } from '@/services/documentsService'
import './DocumentUploadPage.css'

export default function DocumentUploadPage() {
  const navigate = useNavigate()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length !== files.length) {
      setError('Only PDF files are allowed')
      return
    }

    // Check file sizes (max 5MB per file)
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

    try {
      // Upload files sequentially
      for (const file of selectedFiles) {
        const base64 = await fileToBase64(file)
        await documentsService.uploadPDF({
          file_base64: base64,
          filename: file.name,
        })
      }

      setUploadSuccess(true)
      
      // Redirect to dashboard after successful upload
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 2000)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Upload failed. Please try again.'
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="document-upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <div className="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1>Upload Your Documents</h1>
          <p className="subtitle">
            To generate personalized cover letters, we need your personal documents.
          </p>
        </div>

        <div className="upload-info">
          <div className="info-card">
            <h3>📄 What to Upload</h3>
            <ul>
              <li>Resume / CV</li>
              <li>Reference Letters</li>
              <li>Education Certificates</li>
              <li>Professional Certifications</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🔒 Privacy & Security</h3>
            <p>
              Your documents are securely stored and only used to generate customized cover letters. 
              We use enterprise-grade encryption to protect your data.
            </p>
          </div>
        </div>

        {uploadSuccess ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Upload Successful!</h2>
            <p>Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <div className="upload-area">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                </div>
              )}
            </div>

            {error && (
              <div className="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="upload-btn"
            >
              {isUploading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  Upload Documents
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

