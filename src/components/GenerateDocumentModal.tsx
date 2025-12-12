import { useState } from 'react'
import './GenerateDocumentModal.css'

interface GenerateDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectCoverLetter: () => void
  onSelectResume: () => void
}

const GenerateDocumentModal = ({
  isOpen,
  onClose,
  onSelectCoverLetter,
  onSelectResume,
}: GenerateDocumentModalProps) => {
  const [isClosing, setIsClosing] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handleCoverLetter = () => {
    handleClose()
    setTimeout(() => {
      onSelectCoverLetter()
    }, 250)
  }

  const handleResume = () => {
    handleClose()
    setTimeout(() => {
      onSelectResume()
    }, 250)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div 
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`modal-content ${isClosing ? 'closing' : ''}`}>
        <button className="modal-close-button" onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="modal-header">
          <h2>Generate Document</h2>
          <p>What would you like to generate?</p>
        </div>

        <div className="modal-options">
          <button 
            className="modal-option-button cover-letter-option"
            onClick={handleCoverLetter}
          >
            <div className="option-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div className="option-content">
              <h3>Cover Letter</h3>
              <p>Generate a personalized cover letter for this job</p>
            </div>
            <div className="option-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>

          <button 
            className="modal-option-button resume-option"
            onClick={handleResume}
          >
            <div className="option-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <div className="option-content">
              <h3>Resume</h3>
              <p>Generate a tailored resume for this position</p>
            </div>
            <div className="option-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerateDocumentModal

