// API Types based on OpenAPI specification
// https://api.project100x.run.place/api/openapi.json

export interface TokenResponse {
  access: string
  refresh: string
  user: User
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string | null
  last_name: string | null
  is_active: boolean
  date_joined: string
}

export interface UserProfile extends User {
  phone_number: string | null
  street: string | null
  city: string | null
  postcode: string | null
  country: string | null
  country_display: string | null
  created_at: string | null
  updated_at: string | null
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  password_confirm: string
  first_name?: string | null
  last_name?: string | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RefreshTokenRequest {
  refresh: string
}

export interface UserProfileUpdate {
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  phone_number?: string | null
  street?: string | null
  city?: string | null
  postcode?: string | null
  country?: string | null
}

export interface CountryOption {
  code: string
  name: string
}

export interface CountriesList {
  countries: CountryOption[]
}

export interface TypstTemplate {
  id: number
  created_at: string
  updated_at: string
  version: number
  name: string
  code: string
}

export interface TypstTemplateListResponse {
  templates: TypstTemplate[]
  count: number
}

export interface MessageResponse {
  message: string
}

export interface ApiError {
  message: string
  detail?: string
  errors?: Record<string, string[]>
}

// Job-related types

export type JobType = 'full_time' | 'part_time' | 'contract' | 'temporary' | 'internship'
export type ExperienceLevel = 'internship' | 'entry_level' | 'associate' | 'mid_senior_level' | 'director'
export type DatePosted = 'any_time' | 'past_24_hours' | 'past_week' | 'past_month'

export interface JobListing {
  job_id: string
  linkedin_url: string
  title: string
  company_name: string
  location: string
  description?: string | null
  employment_type?: string | null
  experience_level?: string | null
  posted_date?: string | null
  applicants_count?: number | null
  company_logo_url?: string | null
}

export interface JobSearchRequest {
  keyword: string
  location: string
  job_types?: JobType[] | null
  experience_levels?: ExperienceLevel[] | null
  date_posted?: DatePosted | null
  limit?: number | null
}

export interface ProfileSearchRequest {
  date_posted?: DatePosted | null
  limit?: number | null
}

export interface JobSearchResponse {
  success: boolean
  total_results: number
  results_count: number
  jobs: JobListing[]
  search_params: Record<string, any>
  message?: string | null
}

export interface ErrorResponse {
  success: boolean
  error: string
  details?: string | null
}

export interface CreateJobFromUrlRequest {
  linkedin_url: string
}

// Cover Letter types
export interface CreateCoverLetterRequest {
  job_id: string
  language?: string | null
  customer_instructions?: string | null
}

export interface CreateCoverLetterSimpleRequest {
  position_title: string
  company_name: string
  job_location: string
  job_description: string
  language?: string | null
  customer_instructions?: string | null
}

export interface CoverLetterResponse {
  success: boolean
  cover_letter_text: string
}

export interface ConvertToPdfRequest {
  template_id: number
  content: string
  company_name: string
}

export interface ConvertToPdfResponse {
  success: boolean
  pdf_base64: string
}

// Document types
export interface PDFUploadRequest {
  file_base64: string
  filename?: string | null
}

export interface UploadResponse {
  message: string
  success: boolean
  uploaded_at: string
}

export interface DocumentStatus {
  has_uploaded_document: boolean
  last_upload_date?: string | null
}

export interface DeleteDataResponse {
  message: string
  success: boolean
}

// Application types
export type ApplicationStatus = 'applied' | 'declined' | 'phone_screening' | 'first_round' | 'second_round' | 'third_round' | 'offer'

export interface CreateJobApplicationRequest {
  job_id?: string | null
  job_title: string
  company_name: string
  job_location?: string | null
  job_url?: string | null
  notes?: string | null
}

export interface JobApplication {
  id: number
  job_id: string | null
  job_title: string
  company_name: string
  job_location: string | null
  job_url: string | null
  notes: string | null
  status: ApplicationStatus
  applied_at: string
  updated_at: string
}

export interface CreateJobApplicationResponse {
  success: boolean
  application: JobApplication
}

export interface JobApplicationListResponse {
  applications: JobApplication[]
  count: number
}

export interface CheckApplicationResponse {
  has_applied: boolean
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus
}

export interface UpdateApplicationStatusResponse {
  success: boolean
  application: JobApplication
}

export interface ApplicationStatsResponse {
  total_applications: number
  applications_this_week: number
  applications_last_7_days: Record<string, number>
  status_counts: {
    applied: number
    declined: number
    phone_screening: number
    first_round: number
    second_round: number
    third_round: number
    offer: number
  }
}

// Search Profile types
export interface SearchProfile {
  id: number
  name: string | null
  keyword: string
  location: string
  job_types: JobType[]
  experience_levels: ExperienceLevel[]
  created_at: string
  updated_at: string
}

export interface CreateSearchProfileRequest {
  name?: string | null
  keyword: string
  location: string
  job_types?: JobType[] | null
  experience_levels?: ExperienceLevel[] | null
}

export interface UpdateSearchProfileRequest {
  name?: string | null
  keyword?: string | null
  location?: string | null
  job_types?: JobType[] | null
  experience_levels?: ExperienceLevel[] | null
}

export interface SearchProfileListResponse {
  profiles: SearchProfile[]
  count: number
}

