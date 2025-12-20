import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { applicationsService } from '@/services/applicationsService'
import type { ApplicationStatsResponse } from '@/types/api'

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
    <div className={`bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-lg ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Progress</h3>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-[120px_1fr] gap-0 items-start max-md:grid-cols-1 max-md:gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="text-[1.75rem] font-bold text-primary leading-none">
                {stats?.total_applications ?? 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">Jobs Tracked</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[1.75rem] font-bold text-primary leading-none">{interviewsCount}</div>
              <div className="text-sm text-gray-600 font-medium">Interviews</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[1.75rem] font-bold text-primary leading-none">
                {stats?.applications_this_week ?? 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">This Week</div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="flex-1 min-w-0 max-md:border-t max-md:border-gray-200 max-md:pt-6">
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
