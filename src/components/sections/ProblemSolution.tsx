import { useEffect, useState, useRef } from 'react'
import { X, Check } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

const problemItems = [
  'Spend 30+ minutes per application',
  'Rewrite cover letter for each job',
  'Lose track of where you applied',
  'Forget to follow up',
  'Generic templates that don\'t stand out',
  'No feedback on what works',
]

const solutionItems = [
  'Apply in 5 minutes with AI personalization',
  'One resume, unlimited tailored applications',
  'Automatic application tracking dashboard',
  'Smart follow-up reminders',
  'Unique cover letters for every job',
  'Analytics on application performance',
]

const ProblemSolution = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver<HTMLElement>({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true,
  })
  
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (hasIntersected) {
      setTimeout(() => {
        setIsAnimated(true)
      }, 200)
    }
  }, [hasIntersected])

  return (
    <section
      id="problem-solution"
      className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
      ref={(node) => {
        if (node) {
          sectionRef.current = node
          ;(elementRef as React.MutableRefObject<HTMLElement | null>).current = node
        }
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(79,70,229,0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Transform Your Job Search
          </h2>
          <p className="text-xl text-gray-600">
            From frustrating and time-consuming to fast and effective
          </p>
        </div>

        {/* Problem vs Solution Grid */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Problem Side */}
          <div className="relative">
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-200 rounded-xl">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  The Old Way
                </h3>
              </div>
              
              <ul className="space-y-4">
                {problemItems.map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-3 transition-all duration-500 ${
                      isAnimated 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-red-100 rounded-xl">
                <p className="text-sm text-red-800 font-medium">
                  Result: Fewer applications, missed opportunities, burnout
                </p>
              </div>
            </div>
          </div>

          {/* Solution Side */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 lg:p-10 shadow-xl">
              {/* Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-semibold shadow-lg">
                With Resumr
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-200 rounded-xl">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  The Resumr Way
                </h3>
              </div>
              
              <ul className="space-y-4">
                {solutionItems.map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-3 transition-all duration-500 ${
                      isAnimated 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 100 + 200}ms` }}
                  >
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                <p className="text-sm text-green-800 font-semibold">
                  Result: 10x more applications, 3x more interviews, dream job secured 🎉
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-4xl font-bold text-primary mb-2">10x</div>
            <div className="text-sm text-gray-600">More Applications</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-4xl font-bold text-secondary mb-2">95%</div>
            <div className="text-sm text-gray-600">Time Saved</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-4xl font-bold text-green-600 mb-2">3x</div>
            <div className="text-sm text-gray-600">More Interviews</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSolution
