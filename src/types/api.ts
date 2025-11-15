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

