import apiClient from './apiClient'
import { apiClientInstance } from './apiClient'
import { API_ENDPOINTS, STORAGE_KEYS } from '@/config/api'
import type {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  TokenResponse,
  User,
  UserProfile,
  UserProfileUpdate,
  CountriesList,
  MessageResponse,
} from '@/types/api'

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    )
    
    // Store tokens and user
    if (response.data) {
      apiClientInstance.setTokens(response.data.access, response.data.refresh)
      if (response.data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user))
      }
    }
    
    return response.data
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    )
    
    // Store tokens and user
    if (response.data) {
      apiClientInstance.setTokens(response.data.access, response.data.refresh)
      if (response.data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user))
      }
    }
    
    return response.data
  },

  /**
   * Refresh access token
   */
  async refreshToken(refresh: string): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh } as RefreshTokenRequest
    )
    
    if (response.data) {
      apiClientInstance.setTokens(response.data.access, response.data.refresh)
    }
    
    return response.data
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME)
    return response.data
  },

  /**
   * Logout user
   */
  async logout(refresh: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      API_ENDPOINTS.AUTH.LOGOUT,
      { refresh } as RefreshTokenRequest
    )
    
    // Clear tokens on logout
    apiClientInstance.clearTokens()
    
    return response.data
  },

  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(API_ENDPOINTS.AUTH.PROFILE)
    return response.data
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UserProfileUpdate): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>(
      API_ENDPOINTS.AUTH.PROFILE,
      data
    )
    return response.data
  },

  /**
   * Get available countries
   */
  async getCountries(): Promise<CountriesList> {
    const response = await apiClient.get<CountriesList>(API_ENDPOINTS.AUTH.COUNTRIES)
    return response.data
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) return null
    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!apiClientInstance.getAccessToken()
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return apiClientInstance.getRefreshToken()
  },

  /**
   * Clear all auth data
   */
  clearAuth(): void {
    apiClientInstance.clearTokens()
  },
}

