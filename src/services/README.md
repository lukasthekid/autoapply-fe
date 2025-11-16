# API Integration

This directory contains all API-related services and configuration for connecting to the AutoApply backend.

## Structure

- `apiClient.ts` - Axios instance with interceptors for authentication and token refresh
- `authService.ts` - Authentication service (login, register, logout, profile management)
- `templatesService.ts` - Templates service (fetching Typst templates)
- `jobsService.ts` - Jobs service (search jobs, manage job listings)

## Configuration

The API base URL is configured in `src/config/api.ts`. You can override it using the `VITE_API_BASE_URL` environment variable.

Default: `https://api.project100x.run.place`

## Usage Examples

### Authentication

```tsx
import { useAuth } from '@/contexts/AuthContext'

function LoginComponent() {
  const { login, user, isAuthenticated } = useAuth()

  const handleLogin = async () => {
    try {
      await login({
        username: 'user@example.com',
        password: 'password123'
      })
      console.log('Logged in as:', user)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### Fetching Templates

```tsx
import { useTemplates } from '@/hooks/useTemplates'

function TemplatesComponent() {
  const { templates, isLoading, error } = useTemplates()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>
          <h3>{template.name}</h3>
          <p>Version: {template.version}</p>
        </div>
      ))}
    </div>
  )
}
```

### Direct API Calls

```tsx
import { authService } from '@/services/authService'
import { templatesService } from '@/services/templatesService'

// Register a new user
const registerUser = async () => {
  try {
    const response = await authService.register({
      email: 'user@example.com',
      username: 'username',
      password: 'password123',
      password_confirm: 'password123'
    })
    console.log('Registered:', response.user)
  } catch (error) {
    console.error('Registration failed:', error)
  }
}

// Fetch templates (requires authentication)
const fetchTemplates = async () => {
  try {
    const response = await templatesService.getAllTemplates()
    console.log('Templates:', response.templates)
  } catch (error) {
    console.error('Failed to fetch templates:', error)
  }
}
```

## Authentication Flow

1. User logs in/registers → tokens stored in localStorage
2. All API requests automatically include the access token in the Authorization header
3. If access token expires (401), the client automatically refreshes using the refresh token
4. If refresh fails, user is logged out and tokens are cleared

## Token Management

Tokens are automatically managed by the `apiClient`. They are stored in localStorage:
- `access_token` - Short-lived JWT access token
- `refresh_token` - Long-lived refresh token
- `user` - Current user object

## API Endpoints

Based on the OpenAPI specification at: https://api.project100x.run.place/api/openapi.json

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/countries` - Get available countries

### Templates
- `GET /api/templates/` - Get all Typst templates (requires auth)
- `POST /api/templates/create-cover-letter` - Create a cover letter (requires auth)

### Jobs
- `POST /api/jobs/search` - Search for jobs on LinkedIn
- `GET /api/jobs/listings` - Get job listings from database
- `GET /api/jobs/listings/{job_id}` - Get specific job listing
- `GET /api/jobs/search-history` - Get recent job search history
- `POST /api/jobs/create-from-url` - Create job listing from LinkedIn URL
- `POST /api/jobs/enrich/{job_id}` - Enrich job details from LinkedIn

