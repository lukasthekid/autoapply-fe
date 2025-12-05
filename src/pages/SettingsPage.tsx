import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'
import { searchProfilesService } from '@/services/searchProfilesService'
import type {
  UserProfile,
  UserProfileUpdate,
  CountryOption,
  SearchProfile,
  CreateSearchProfileRequest,
  UpdateSearchProfileRequest,
  JobType,
  ExperienceLevel,
} from '@/types/api'
import './SettingsPage.css'

const SettingsPage = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Search Profiles state
  const [searchProfiles, setSearchProfiles] = useState<SearchProfile[]>([])
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)

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

  // Search Profile form state
  const [profileFormData, setProfileFormData] = useState<{
    name: string
    keyword: string
    location: string
    job_types: JobType[]
    experience_levels: ExperienceLevel[]
  }>({
    name: '',
    keyword: '',
    location: '',
    job_types: [],
    experience_levels: [],
  })

  // Load profile, countries, and search profiles on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [profileData, countriesData, profilesData] = await Promise.all([
          authService.getProfile(),
          authService.getCountries(),
          searchProfilesService.getAllSearchProfiles().catch(() => ({ profiles: [], count: 0 })),
        ])
        
        setProfile(profileData)
        setCountries(countriesData.countries)
        setSearchProfiles(profilesData.profiles || [])
        
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

  // Load search profiles
  const loadSearchProfiles = async () => {
    try {
      setIsLoadingProfiles(true)
      const data = await searchProfilesService.getAllSearchProfiles()
      setSearchProfiles(data.profiles)
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || 'Failed to load search profiles')
    } finally {
      setIsLoadingProfiles(false)
    }
  }

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

    // Validate that user has at least one search profile
    if (searchProfiles.length === 0) {
      setError('You must have at least one search profile to save your settings.')
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

  // Search Profile handlers
  const handleProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setProfileFormData(prev => ({ ...prev, [name]: value }))
    setProfileError(null)
    setProfileSuccess(false)
  }

  const handleJobTypeChange = (jobType: JobType, checked: boolean) => {
    setProfileFormData(prev => ({
      ...prev,
      job_types: checked
        ? [...prev.job_types, jobType]
        : prev.job_types.filter(t => t !== jobType),
    }))
  }

  const handleExperienceLevelChange = (level: ExperienceLevel, checked: boolean) => {
    setProfileFormData(prev => ({
      ...prev,
      experience_levels: checked
        ? [...prev.experience_levels, level]
        : prev.experience_levels.filter(l => l !== level),
    }))
  }

  const handleEditProfile = (profile: SearchProfile) => {
    setEditingProfileId(profile.id)
    setProfileFormData({
      name: profile.name || '',
      keyword: profile.keyword,
      location: profile.location,
      job_types: profile.job_types || [],
      experience_levels: profile.experience_levels || [],
    })
    setShowProfileForm(true)
    setProfileError(null)
    setProfileSuccess(false)
  }

  const handleNewProfile = () => {
    setEditingProfileId(null)
    setProfileFormData({
      name: '',
      keyword: '',
      location: '',
      job_types: [],
      experience_levels: [],
    })
    setShowProfileForm(true)
    setProfileError(null)
    setProfileSuccess(false)
  }

  const handleCancelProfileForm = () => {
    setShowProfileForm(false)
    setEditingProfileId(null)
    setProfileFormData({
      name: '',
      keyword: '',
      location: '',
      job_types: [],
      experience_levels: [],
    })
    setProfileError(null)
  }

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(false)

    // Validate required fields
    if (!profileFormData.keyword.trim() || !profileFormData.location.trim()) {
      setProfileError('Keyword and Location are required fields.')
      return
    }

    setIsSavingProfile(true)

    try {
      if (editingProfileId) {
        // Update existing profile
        const updateData: UpdateSearchProfileRequest = {
          name: profileFormData.name.trim() || null,
          keyword: profileFormData.keyword.trim() || null,
          location: profileFormData.location.trim() || null,
          job_types: profileFormData.job_types.length > 0 ? profileFormData.job_types : null,
          experience_levels:
            profileFormData.experience_levels.length > 0
              ? profileFormData.experience_levels
              : null,
        }
        await searchProfilesService.updateSearchProfile(editingProfileId, updateData)
      } else {
        // Create new profile
        const createData: CreateSearchProfileRequest = {
          name: profileFormData.name.trim() || null,
          keyword: profileFormData.keyword.trim(),
          location: profileFormData.location.trim(),
          job_types: profileFormData.job_types.length > 0 ? profileFormData.job_types : null,
          experience_levels:
            profileFormData.experience_levels.length > 0
              ? profileFormData.experience_levels
              : null,
        }
        await searchProfilesService.createSearchProfile(createData)
      }

      setProfileSuccess(true)
      await loadSearchProfiles()
      handleCancelProfileForm()

      // Clear success message after 3 seconds
      setTimeout(() => setProfileSuccess(false), 3000)
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

      setProfileError(errorMessage || 'Failed to save search profile. Please try again.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleDeleteProfile = async (id: number) => {
    if (!confirm('Are you sure you want to delete this search profile?')) {
      return
    }

    // Prevent deletion if it's the last profile
    if (searchProfiles.length === 1) {
      setProfileError('You must have at least one search profile. Cannot delete the last profile.')
      return
    }

    try {
      await searchProfilesService.deleteSearchProfile(id)
      await loadSearchProfiles()
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err: any) {
      const errorData = err?.response?.data
      setProfileError(
        errorData?.message || errorData?.detail || err?.message || 'Failed to delete search profile.'
      )
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

          {/* Search Profiles Section */}
          <div className="settings-section">
            <div className="settings-section-header">
              <h2>Search Profiles</h2>
              {!showProfileForm && (
                <button
                  type="button"
                  className="btn-secondary btn-small"
                  onClick={handleNewProfile}
                >
                  + Add Profile
                </button>
              )}
            </div>

            {profileError && (
              <div className="settings-error" style={{ marginBottom: '1rem' }}>
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="settings-success" style={{ marginBottom: '1rem' }}>
                ✓ Search profile {editingProfileId ? 'updated' : 'created'} successfully!
              </div>
            )}

            {showProfileForm ? (
              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="form-group">
                  <label htmlFor="profile_name">Profile Name (Optional)</label>
                  <input
                    type="text"
                    id="profile_name"
                    name="name"
                    value={profileFormData.name}
                    onChange={handleProfileInputChange}
                    placeholder="e.g., Software Engineer - Remote"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profile_keyword">Keyword *</label>
                    <input
                      type="text"
                      id="profile_keyword"
                      name="keyword"
                      value={profileFormData.keyword}
                      onChange={handleProfileInputChange}
                      placeholder="e.g., Software Engineer"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile_location">Location *</label>
                    <input
                      type="text"
                      id="profile_location"
                      name="location"
                      value={profileFormData.location}
                      onChange={handleProfileInputChange}
                      placeholder="e.g., New York, NY"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Job Types (Optional)</label>
                  <div className="checkbox-group">
                    {(['full_time', 'part_time', 'contract', 'temporary', 'internship'] as JobType[]).map(
                      (jobType) => (
                        <label key={jobType} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={profileFormData.job_types.includes(jobType)}
                            onChange={(e) =>
                              handleJobTypeChange(jobType, e.target.checked)
                            }
                          />
                          <span>
                            {jobType
                              .split('_')
                              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(' ')}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Experience Levels (Optional)</label>
                  <div className="checkbox-group">
                    {([
                      'internship',
                      'entry_level',
                      'associate',
                      'mid_senior_level',
                      'director',
                    ] as ExperienceLevel[]).map((level) => (
                      <label key={level} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={profileFormData.experience_levels.includes(level)}
                          onChange={(e) =>
                            handleExperienceLevelChange(level, e.target.checked)
                          }
                        />
                        <span>
                          {level
                            .split('_')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="settings-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelProfileForm}
                    disabled={isSavingProfile}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary btn-glow"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile
                      ? 'Saving...'
                      : editingProfileId
                      ? 'Update Profile'
                      : 'Create Profile'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {isLoadingProfiles ? (
                  <div className="settings-loading" style={{ minHeight: '200px' }}>
                    <div className="loading-spinner"></div>
                    <p>Loading search profiles...</p>
                  </div>
                ) : searchProfiles.length === 0 ? (
                  <div className="empty-state">
                    <p>No search profiles yet. Create your first one to get started!</p>
                  </div>
                ) : (
                  <div className="profiles-list">
                    {searchProfiles.map((profile) => (
                      <div key={profile.id} className="profile-card">
                        <div className="profile-card-content">
                          <div className="profile-card-header">
                            <h3>{profile.name || 'Unnamed Profile'}</h3>
                            <div className="profile-card-actions">
                              <button
                                type="button"
                                className="btn-link"
                                onClick={() => handleEditProfile(profile)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn-link btn-link-danger"
                                onClick={() => handleDeleteProfile(profile.id)}
                                disabled={searchProfiles.length === 1}
                                title={
                                  searchProfiles.length === 1
                                    ? 'You must have at least one search profile'
                                    : 'Delete profile'
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="profile-card-details">
                            <div className="profile-detail">
                              <span className="profile-detail-label">Keyword:</span>
                              <span className="profile-detail-value">{profile.keyword}</span>
                            </div>
                            <div className="profile-detail">
                              <span className="profile-detail-label">Location:</span>
                              <span className="profile-detail-value">{profile.location}</span>
                            </div>
                            {profile.job_types && profile.job_types.length > 0 && (
                              <div className="profile-detail">
                                <span className="profile-detail-label">Job Types:</span>
                                <span className="profile-detail-value">
                                  {profile.job_types
                                    .map((t) =>
                                      t
                                        .split('_')
                                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                        .join(' ')
                                    )
                                    .join(', ')}
                                </span>
                              </div>
                            )}
                            {profile.experience_levels &&
                              profile.experience_levels.length > 0 && (
                                <div className="profile-detail">
                                  <span className="profile-detail-label">Experience:</span>
                                  <span className="profile-detail-value">
                                    {profile.experience_levels
                                      .map((l) =>
                                        l
                                          .split('_')
                                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                          .join(' ')
                                      )
                                      .join(', ')}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

