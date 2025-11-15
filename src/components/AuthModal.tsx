import { useState, FormEvent, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '@/contexts/AuthContext'
import './AuthModal.css'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { login, register } = useAuth()

  // Update mode when initialMode prop changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setError(null)
      setSuccess(false)
    }
  }, [initialMode, isOpen])

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const validateForm = (): boolean => {
    if (mode === 'signup') {
      if (!formData.username || formData.username.length < 3) {
        setError('Username must be at least 3 characters')
        return false
      }
      if (!formData.email || !formData.email.includes('@')) {
        setError('Please enter a valid email address')
        return false
      }
      if (!formData.password || formData.password.length < 8) {
        setError('Password must be at least 8 characters')
        return false
      }
      if (formData.password !== formData.password_confirm) {
        setError('Passwords do not match')
        return false
      }
    } else {
      if (!formData.username) {
        setError('Please enter your username')
        return false
      }
      if (!formData.password) {
        setError('Please enter your password')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (mode === 'login') {
        await login({
          username: formData.username,
          password: formData.password,
        })
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password_confirm: formData.password_confirm,
          first_name: formData.first_name || null,
          last_name: formData.last_name || null,
        })
      }
      // Success - show success message briefly then close
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setFormData({
          username: '',
          email: '',
          password: '',
          password_confirm: '',
          first_name: '',
          last_name: '',
        })
        setSuccess(false)
        setError(null)
      }, 1000)
    } catch (err: any) {
      // Handle API error responses
      const errorData = err?.response?.data
      let errorMessage = ''

      if (errorData?.errors) {
        // Handle field-specific errors
        const fieldErrors = Object.entries(errorData.errors)
          .map(([field, messages]: [string, any]) => {
            const fieldName = field.replace(/_/g, ' ')
            return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
          })
          .join('\n')
        errorMessage = fieldErrors
      } else {
        errorMessage = errorData?.message || errorData?.detail || err?.message
      }

      setError(
        errorMessage ||
        (mode === 'login' ? 'Login failed. Please check your credentials.' : 'Registration failed. Please try again.')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    const newMode = mode === 'login' ? 'signup' : 'login'
    setMode(newMode)
    setError(null)
    setSuccess(false)
    setFormData({
      username: '',
      email: '',
      password: '',
      password_confirm: '',
      first_name: '',
      last_name: '',
    })
  }

  const modalContent = (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="auth-modal-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{mode === 'login' ? 'Sign in to your account to continue' : 'Start your journey with AutoApply'}</p>
        </div>

        {error && (
          <div className="auth-modal-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-modal-success">
            {mode === 'login' ? '✓ Successfully logged in!' : '✓ Account created successfully!'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {mode === 'signup' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name (Optional)</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name (Optional)</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="johndoe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={mode === 'login' ? 'Enter your password' : 'At least 8 characters'}
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="password_confirm">Confirm Password *</label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary btn-large btn-glow"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-modal-footer">
          <p>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={switchMode} className="auth-modal-link">
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )

  // Render modal using portal to document.body to avoid z-index issues
  return isOpen && typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null
}

export default AuthModal

