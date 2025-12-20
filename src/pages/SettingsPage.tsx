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
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Settings</h1>
        <p className="text-lg text-gray-600">Manage your personal information and preferences</p>
      </div>

      {/* Global Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span className="text-red-800 whitespace-pre-wrap">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span className="text-green-800 font-medium">✓ Profile updated successfully!</span>
          </div>
        </div>
      )}

      {/* Notice Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
            📝
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Complete Your Profile</h3>
            <p className="text-blue-800 leading-relaxed">
              All fields below are required to generate professional cover letters. 
              This information will be used in the sender section of your cover letters, 
              including your name, contact details, and address. Please fill in all fields 
              to ensure your cover letters are properly formatted and professional.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Account Information Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
          <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 mb-1">Username</span>
              <span className="text-base text-gray-900 font-medium">{user?.username}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 mb-1">User ID</span>
              <span className="text-base text-gray-900 font-medium">{user?.id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600 mb-1">Member since</span>
              <span className="text-base text-gray-900 font-medium">
                {profile?.date_joined
                  ? new Date(profile.date_joined).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="John"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Address Information</h2>
            
            <div className="mb-6">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="123 Main Street"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Search Profiles Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Search Profiles</h2>
            {!showProfileForm && (
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
                onClick={handleNewProfile}
              >
                + Add Profile
              </button>
            )}
          </div>

          {profileError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 shadow-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span className="text-red-800 whitespace-pre-wrap">{profileError}</span>
              </div>
            </div>
          )}

          {profileSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 shadow-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-green-800 font-medium">
                  ✓ Search profile {editingProfileId ? 'updated' : 'created'} successfully!
                </span>
              </div>
            </div>
          )}

          {showProfileForm ? (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label htmlFor="profile_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Name (Optional)
                </label>
                <input
                  type="text"
                  id="profile_name"
                  name="name"
                  value={profileFormData.name}
                  onChange={handleProfileInputChange}
                  placeholder="e.g., Software Engineer - Remote"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                <div>
                  <label htmlFor="profile_keyword" className="block text-sm font-medium text-gray-700 mb-2">
                    Keyword <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="profile_keyword"
                    name="keyword"
                    value={profileFormData.keyword}
                    onChange={handleProfileInputChange}
                    placeholder="e.g., Software Engineer"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="profile_location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="profile_location"
                    name="location"
                    value={profileFormData.location}
                    onChange={handleProfileInputChange}
                    placeholder="e.g., New York, NY"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Job Types (Optional)</label>
                <div className="flex flex-wrap gap-4">
                  {(['full_time', 'part_time', 'contract', 'temporary', 'internship'] as JobType[]).map(
                    (jobType) => (
                      <label key={jobType} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileFormData.job_types.includes(jobType)}
                          onChange={(e) => handleJobTypeChange(jobType, e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Experience Levels (Optional)</label>
                <div className="flex flex-wrap gap-4">
                  {([
                    'internship',
                    'entry_level',
                    'associate',
                    'mid_senior_level',
                    'director',
                  ] as ExperienceLevel[]).map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileFormData.experience_levels.includes(level)}
                        onChange={(e) => handleExperienceLevelChange(level, e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">
                        {level
                          .split('_')
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCancelProfileForm}
                  disabled={isSavingProfile}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
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
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading search profiles...</p>
                </div>
              ) : searchProfiles.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  <p>No search profiles yet. Create your first one to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchProfiles.map((profile) => (
                    <div key={profile.id} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{profile.name || 'Unnamed Profile'}</h3>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                            onClick={() => handleEditProfile(profile)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[100px]">Keyword:</span>
                          <span className="text-sm text-gray-900">{profile.keyword}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[100px]">Location:</span>
                          <span className="text-sm text-gray-900">{profile.location}</span>
                        </div>
                        {profile.job_types && profile.job_types.length > 0 && (
                          <div className="flex items-start">
                            <span className="text-sm font-medium text-gray-600 min-w-[100px]">Job Types:</span>
                            <span className="text-sm text-gray-900">
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
                            <div className="flex items-start">
                              <span className="text-sm font-medium text-gray-600 min-w-[100px]">Experience:</span>
                              <span className="text-sm text-gray-900">
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
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
