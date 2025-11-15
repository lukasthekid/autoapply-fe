import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'
import type { UserProfile, UserProfileUpdate, CountryOption } from '@/types/api'
import './SettingsPage.css'

const SettingsPage = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state - using string type since all fields are required
  const [formData, setFormData] = useState<{
    email: string
    first_name: string
    last_name: string
    phone_number: string
    street: string
    city: string
    postcode: string
    country: string
  }>({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    street: '',
    city: '',
    postcode: '',
    country: '',
  })

  // Load profile and countries on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [profileData, countriesData] = await Promise.all([
          authService.getProfile(),
          authService.getCountries(),
        ])
        
        setProfile(profileData)
        setCountries(countriesData.countries)
        
        // Initialize form with profile data
        setFormData({
          email: profileData.email || '',
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone_number: profileData.phone_number || '',
          street: profileData.street || '',
          city: profileData.city || '',
          postcode: profileData.postcode || '',
          country: profileData.country || '',
        })
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
    setSuccess(false)
  }

  const validateForm = (): boolean => {
    const requiredFields = [
      { key: 'email', label: 'Email' },
      { key: 'first_name', label: 'First Name' },
      { key: 'last_name', label: 'Last Name' },
      { key: 'phone_number', label: 'Phone Number' },
      { key: 'street', label: 'Street Address' },
      { key: 'city', label: 'City' },
      { key: 'postcode', label: 'Postal Code' },
      { key: 'country', label: 'Country' },
    ]

    const missingFields = requiredFields.filter(
      field => !formData[field.key as keyof typeof formData]?.trim()
    )

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(f => f.label).join(', ')
      setError(`Please fill in all required fields: ${fieldNames}`)
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validate all fields are filled
    if (!validateForm()) {
      return
    }

    setIsSaving(true)

    try {
      // All fields are validated and guaranteed to be strings at this point
      const updateData: UserProfileUpdate = {
        email: formData.email.trim() || null,
        first_name: formData.first_name.trim() || null,
        last_name: formData.last_name.trim() || null,
        phone_number: formData.phone_number.trim() || null,
        street: formData.street.trim() || null,
        city: formData.city.trim() || null,
        postcode: formData.postcode.trim() || null,
        country: formData.country.trim() || null,
      }

      await updateProfile(updateData)
      setSuccess(true)
      
      // Reload profile to get updated data
      const updatedProfile = await authService.getProfile()
      setProfile(updatedProfile)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      const errorData = err?.response?.data
      let errorMessage = ''

      if (errorData?.errors) {
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
        errorMessage || 'Failed to update profile. Please try again.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="settings-page">
        <div className="container">
          <div className="settings-loading">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <div className="container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your personal information and preferences</p>
        </div>

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        {success && (
          <div className="settings-success">
            ✓ Profile updated successfully!
          </div>
        )}

        <div className="settings-content">
          <div className="settings-notice">
            <div className="notice-icon">📝</div>
            <div className="notice-content">
              <h3>Complete Your Profile</h3>
              <p>
                All fields below are required to generate professional cover letters. 
                This information will be used in the sender section of your cover letters, 
                including your name, contact details, and address. Please fill in all fields 
                to ensure your cover letters are properly formatted and professional.
              </p>
            </div>
          </div>

          <div className="settings-section">
            <h2>Account Information</h2>
            <div className="settings-info">
              <div className="info-item">
                <span className="info-label">Username:</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">User ID:</span>
                <span className="info-value">{user?.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Member since:</span>
                <span className="info-value">
                  {profile?.date_joined
                    ? new Date(profile.date_joined).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="settings-form">
            <div className="settings-section">
              <h2>Personal Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
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

              <div className="form-group">
                <label htmlFor="phone_number">Phone Number *</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>
            </div>

            <div className="settings-section">
              <h2>Address Information</h2>
              
              <div className="form-group">
                <label htmlFor="street">Street Address *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postcode">Postal Code *</label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">Country *</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="settings-actions">
              <button
                type="submit"
                className="btn-primary btn-large btn-glow"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

