import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { applicationsService } from '@/services/applicationsService'
import type { ApplicationStatsResponse } from '@/types/api'
import './YourProgress.css'

interface YourProgressProps {
  className?: string
}

const YourProgress = ({ className }: YourProgressProps) => {
  const [stats, setStats] = useState<ApplicationStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await applicationsService.getStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Calculate interviews count from status counts
  const interviewsCount = stats
    ? stats.status_counts.phone_screening +
      stats.status_counts.first_round +
      stats.status_counts.second_round +
      stats.status_counts.third_round
    : 0

  // Transform last 7 days data for chart
  const chartData = stats?.applications_last_7_days
    ? Object.entries(stats.applications_last_7_days)
        .map(([date, count]) => {
          // Format date for display (e.g., "2024-01-15" -> "Jan 15" or "01/15")
          const dateObj = new Date(date)
          const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
          const day = dateObj.getDate()
          return {
            date: `${month} ${day}`,
            fullDate: date,
            applications: count,
          }
        })
        .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    : []

  return (
    <div className={`your-progress ${className || ''}`}>
      <h3 className="your-progress-title">Your Progress</h3>
      {loading ? (
        <div className="your-progress-loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="your-progress-content">
          <div className="your-progress-stats-grid">
            <div className="your-progress-stat-item">
              <div className="your-progress-stat-value">
                {stats?.total_applications ?? 0}
              </div>
              <div className="your-progress-stat-label">Jobs Tracked</div>
            </div>
            <div className="your-progress-stat-item">
              <div className="your-progress-stat-value">{interviewsCount}</div>
              <div className="your-progress-stat-label">Interviews</div>
            </div>
            <div className="your-progress-stat-item">
              <div className="your-progress-stat-value">
                {stats?.applications_this_week ?? 0}
              </div>
              <div className="your-progress-stat-label">This Week</div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="your-progress-chart">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                    labelStyle={{ color: '#374151', fontWeight: 600 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default YourProgress

