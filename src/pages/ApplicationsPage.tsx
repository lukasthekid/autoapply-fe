import { useState, useEffect } from 'react'
import { applicationsService } from '@/services/applicationsService'
import type { JobApplication } from '@/types/api'
import './ApplicationsPage.css'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await applicationsService.getAllApplications()
      setApplications(data.applications || [])
    } catch (err: any) {
      setError('Failed to load applications')
      console.error('Error fetching applications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="applications-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="applications-page">
      <div className="applications-container">
        <div className="page-header">
          <h1>My Applications</h1>
          <p>Track all your job applications in one place</p>
        </div>

        {error && (
          <div className="message error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
            <button onClick={fetchApplications} className="retry-btn">Retry</button>
          </div>
        )}

        {applications.length === 0 && !error ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h2>No Applications Yet</h2>
            <p>Start applying to jobs to see them here</p>
          </div>
        ) : (
          <div className="applications-table-container">
            <div className="table-header">
              <span className="table-count">
                {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
              </span>
            </div>
            
            <div className="table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Location</th>
                    <th>Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="company-cell">
                          <span className="company-name">{app.company_name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="position-cell">
                          <span className="position-title">{app.job_title}</span>
                        </div>
                      </td>
                      <td>
                        <div className="location-cell">
                          {app.job_location ? (
                            <span className="location-text">{app.job_location}</span>
                          ) : (
                            <span className="location-empty">—</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          <span className="date-text">{formatDate(app.applied_at)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          {app.job_url && (
                            <a
                              href={app.job_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-link"
                              title="View Job Posting"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
