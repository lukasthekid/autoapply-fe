import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react'

const SocialProof = () => {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Users',
      color: 'text-primary',
      bgColor: 'bg-indigo-100',
    },
    {
      icon: FileText,
      value: '50,000+',
      label: 'Documents Generated',
      color: 'text-secondary',
      bgColor: 'bg-teal-100',
    },
    {
      icon: Briefcase,
      value: '25,000+',
      label: 'Applications Tracked',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: TrendingUp,
      value: '85%',
      label: 'Interview Rate',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
              style={{
                animation: 'fadeIn 0.6s ease-out forwards',
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
              }}
            >
              <div className={`p-4 ${stat.bgColor} rounded-xl mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
            Trusted by job seekers at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {/* Placeholder for company logos */}
            <div className="text-2xl font-bold text-gray-400">Google</div>
            <div className="text-2xl font-bold text-gray-400">Microsoft</div>
            <div className="text-2xl font-bold text-gray-400">Amazon</div>
            <div className="text-2xl font-bold text-gray-400">Apple</div>
            <div className="text-2xl font-bold text-gray-400">Meta</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SocialProof

