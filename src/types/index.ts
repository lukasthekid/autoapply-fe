// Common type definitions for the application

export interface User {
  id: string
  name: string
  email: string
}

export interface JobApplication {
  id: string
  company: string
  position: string
  status: 'pending' | 'submitted' | 'reviewed' | 'rejected' | 'accepted'
  appliedAt: Date
}

// Add more types as needed

