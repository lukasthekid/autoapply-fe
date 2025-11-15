// API Configuration

/**
 * Determines the API base URL based on environment:
 * - Development: Uses remote API URL (https://api.project100x.run.place)
 * - Production: Uses relative URLs (empty string) when deployed on same server
 * - Can be overridden with VITE_API_BASE_URL environment variable
 */
function getApiBaseUrl(): string {
  // Allow explicit override via environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }

  // In development mode, use remote API
  if (import.meta.env.DEV) {
    return 'https://api.project100x.run.place'
  }

  // In production, use relative URLs (same server)
  // This works when FE and BE are deployed on the same server
  return ''
}

export const API_BASE_URL = getApiBaseUrl()

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    mode: import.meta.env.MODE,
    baseURL: API_BASE_URL || '(relative URLs)',
    envOverride: import.meta.env.VITE_API_BASE_URL || '(not set)',
  })
}

export const API_ENDPOINTS = {
  // Health
  HEALTH: '/api/',
  
  // Authentication
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    COUNTRIES: '/api/auth/countries',
  },
  
  // Templates
  TEMPLATES: {
    LIST: '/api/templates/',
  },
} as const

// Token storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const

