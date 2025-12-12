import { useState, useEffect } from 'react'
import { applicationsService } from '@/services/applicationsService'
import type { JobApplication, ApplicationStatus } from '@/types/api'
import './ApplicationsPage.css'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

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

  const handleStatusChange = async (applicationId: number, newStatus: ApplicationStatus) => {
    try {
      setUpdatingId(applicationId)
      const response = await applicationsService.updateApplicationStatus(applicationId, newStatus)
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? response.application : app
        )
      )
    } catch (err: any) {
      setError('Failed to update application status')
      console.error('Error updating application status:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (applicationId: number) => {
    try {
      setDeletingId(applicationId)
      setError(null)
      await applicationsService.deleteApplication(applicationId)
      setApplications(prev => prev.filter(app => app.id !== applicationId))
    } catch (err: any) {
      setError('Failed to delete application')
      console.error('Error deleting application:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusColor = (status: ApplicationStatus) => {
    const colors: Record<ApplicationStatus, string> = {
      applied: 'var(--primary-color)',
      declined: '#ef4444',
      phone_screening: '#f59e0b',
      first_round: '#3b82f6',
      second_round: '#8b5cf6',
      third_round: '#ec4899',
      offer: '#10b981',
    }
    return colors[status]
  }

  // Calculate KPIs
  const calculateKPIs = () => {
    const total = applications.length
    const active = applications.filter(app => 
      ['phone_screening', 'first_round', 'second_round', 'third_round'].includes(app.status)
    ).length
    const offers = applications.filter(app => app.status === 'offer').length
    const declined = applications.filter(app => app.status === 'declined').length
    const applied = applications.filter(app => app.status === 'applied').length
    const responseRate = total > 0 
      ? Math.round(((total - applied) / total) * 100) 
      : 0

    return { total, active, offers, declined, applied, responseRate }
  }

  const kpis = calculateKPIs()

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

        {applications.length > 0 && !error && (
          <div className="kpi-section">
            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{kpis.total}</div>
                <div className="kpi-label">Total Applications</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{kpis.active}</div>
                <div className="kpi-label">In Progress</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{kpis.offers}</div>
                <div className="kpi-label">Offers</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{kpis.declined}</div>
                <div className="kpi-label">Declined</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="kpi-content">
                <div className="kpi-value">{kpis.responseRate}%</div>
                <div className="kpi-label">Response Rate</div>
              </div>
            </div>
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
                    <th>Status</th>
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
                        <div className="status-cell">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                            disabled={updatingId === app.id}
                            className="status-select"
                            style={{ '--status-color': getStatusColor(app.status) } as React.CSSProperties}
                          >
                            <option value="applied">Applied</option>
                            <option value="phone_screening">Phone Screening</option>
                            <option value="first_round">First Round</option>
                            <option value="second_round">Second Round</option>
                            <option value="third_round">Third Round</option>
                            <option value="offer">Offer</option>
                            <option value="declined">Declined</option>
                          </select>
                          {updatingId === app.id && (
                            <span className="status-updating">Updating...</span>
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
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="action-link delete-button"
                            title="Remove Application"
                            aria-label="Remove Application"
                            disabled={deletingId === app.id}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                              <path d="M10 11v6"></path>
                              <path d="M14 11v6"></path>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                            </svg>
                            {deletingId === app.id && <span className="status-updating">Removing...</span>}
                          </button>
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
