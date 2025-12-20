import { Check, X } from 'lucide-react'

const ComparisonTable = () => {
  const comparisons = [
    {
      feature: 'Time per application',
      traditional: '2-3 hours',
      resumr: '5 minutes',
      highlight: true,
    },
    {
      feature: 'Cover letter quality',
      traditional: 'Varies by effort',
      resumr: 'Consistently professional',
    },
    {
      feature: 'ATS optimization',
      traditional: 'Manual keyword matching',
      resumr: 'AI-powered optimization',
    },
    {
      feature: 'Application tracking',
      traditional: 'Spreadsheets',
      resumr: 'Centralized dashboard',
    },
    {
      feature: 'Job search',
      traditional: 'Multiple websites',
      resumr: 'All-in-one platform',
      highlight: true,
    },
    {
      feature: 'Document management',
      traditional: 'Scattered files',
      resumr: 'Unlimited cloud storage',
    },
    {
      feature: 'Personalization',
      traditional: 'Copy-paste templates',
      resumr: 'AI tailored to each job',
    },
    {
      feature: 'Follow-up reminders',
      traditional: '❌',
      resumr: '✓',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full">
            <span className="text-sm font-semibold text-amber-700">Comparison</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Why Choose Resumr?
          </h2>
          <p className="text-xl text-gray-600">
            See how we stack up against traditional job application methods
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Feature
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Traditional Method
                </div>
                <div className="inline-flex items-center justify-center px-3 py-1 bg-gray-200 rounded-full">
                  <X className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                  Resumr
                </div>
                <div className="inline-flex items-center justify-center px-3 py-1 bg-gradient-to-r from-primary to-secondary rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {comparisons.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors ${
                    item.highlight ? 'bg-primary/5' : ''
                  }`}
                  style={{
                    animation: 'fadeIn 0.6s ease-out forwards',
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <div className="font-medium text-gray-900 flex items-center">
                    {item.feature}
                    {item.highlight && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full">
                        Key Difference
                      </span>
                    )}
                  </div>
                  <div className="text-center text-gray-600 flex items-center justify-center">
                    {item.traditional === '❌' ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : (
                      <span className="text-sm">{item.traditional}</span>
                    )}
                  </div>
                  <div className="text-center font-semibold text-primary flex items-center justify-center">
                    {item.resumr === '✓' ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <span className="text-sm">{item.resumr}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">10x</div>
              <div className="text-sm text-gray-600">Faster applications</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Time saved</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">3x</div>
              <div className="text-sm text-gray-600">More interviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComparisonTable

