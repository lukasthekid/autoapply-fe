import { useState, useEffect } from 'react'
import { applicationsService } from '@/services/applicationsService'
import type { JobApplication, ApplicationStatus } from '@/types/api'

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
      applied: '#4f46e5',
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
      <div className="min-h-screen max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-gray-600">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-primary rounded-full animate-spin"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-[1400px] mx-auto relative z-10">
      <div className="flex flex-col gap-8">
        <div className="mb-2">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">My Applications</h1>
          <p className="text-gray-600 text-lg">Track all your job applications in one place</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50/80 border border-red-200 text-red-700 backdrop-blur-sm animate-slide-up">
            <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
            <button onClick={fetchApplications} className="ml-auto px-3 py-1.5 bg-red-100/80 border border-red-300 rounded-lg text-red-700 text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-red-200/80 hover:border-red-400 hover:-translate-y-0.5 hover:shadow-sm">
              Retry
            </button>
          </div>
        )}

        {applications.length > 0 && !error && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-xl border border-indigo-500/15 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:border-indigo-500/25">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 bg-indigo-500/10 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-3xl font-bold text-gray-900 leading-tight mb-1">{kpis.total}</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">Total Applications</div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-indigo-500/15 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:border-indigo-500/25">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 bg-blue-500/10 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-3xl font-bold text-gray-900 leading-tight mb-1">{kpis.active}</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">In Progress</div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-indigo-500/15 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:border-indigo-500/25">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 bg-green-500/10 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-3xl font-bold text-gray-900 leading-tight mb-1">{kpis.offers}</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">Offers</div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-indigo-500/15 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:border-indigo-500/25">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 bg-red-500/10 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-3xl font-bold text-gray-900 leading-tight mb-1">{kpis.declined}</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">Declined</div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-indigo-500/15 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:border-indigo-500/25">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 bg-amber-500/10 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-3xl font-bold text-gray-900 leading-tight mb-1">{kpis.responseRate}%</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">Response Rate</div>
              </div>
            </div>
          </div>
        )}

        {applications.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center bg-white/70 backdrop-blur-xl border border-indigo-500/15 rounded-2xl p-12 shadow-md">
            <div className="w-20 h-20 flex items-center justify-center bg-indigo-500/8 rounded-full text-primary mb-2 border border-indigo-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 m-0">No Applications Yet</h2>
            <p className="text-gray-600 text-base m-0">Start applying to jobs to see them here</p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl border border-indigo-500/15 rounded-2xl p-6 overflow-hidden shadow-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-semibold text-gray-900">
                {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
              </span>
            </div>
            
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full border-collapse bg-transparent">
                <thead className="bg-indigo-500/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-indigo-500/15">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-indigo-500/15">Position</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-indigo-500/15 max-md:hidden">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-indigo-500/15">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-indigo-500/15">Applied Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-indigo-500/15">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-indigo-500/8 transition-all duration-200 hover:bg-indigo-500/8">
                      <td className="px-4 py-5 align-middle">
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-900 text-base">{app.company_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 align-middle">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 text-base">{app.job_title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 align-middle max-md:hidden">
                        <div className="flex items-center">
                          {app.job_location ? (
                            <span className="text-gray-600 text-[15px]">{app.job_location}</span>
                          ) : (
                            <span className="text-gray-600 opacity-50 italic">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5 align-middle">
                        <div className="flex items-center gap-2">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                            disabled={updatingId === app.id}
                            className="px-3 py-2 border border-indigo-500/15 rounded-lg bg-gray-50 text-gray-900 text-sm font-medium cursor-pointer transition-all duration-200 min-w-[140px] hover:border-indigo-500/30 hover:shadow-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
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
                            <span className="text-xs text-gray-600 italic">Updating...</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5 align-middle">
                        <div className="flex items-center">
                          <span className="text-gray-600 text-[15px]">{formatDate(app.applied_at)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 align-middle">
                        <div className="flex items-center gap-3">
                          {app.job_url && (
                            <a
                              href={app.job_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-8 h-8 text-primary bg-indigo-500/10 border border-indigo-500/15 rounded-lg transition-all duration-200 cursor-pointer no-underline hover:bg-indigo-500/15 hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-sm"
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
                            className="flex items-center justify-center w-8 h-8 text-primary bg-indigo-500/10 border border-indigo-500/15 rounded-lg transition-all duration-200 cursor-pointer hover:bg-indigo-500/15 hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
                            {deletingId === app.id && <span className="text-xs text-gray-600 italic ml-1">Removing...</span>}
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
