import './Features.css'

interface Feature {
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    title: 'Smart Matching',
    description: 'AI analyzes job descriptions and matches them with your profile automatically.',
    icon: '🎯',
  },
  {
    title: 'Auto-Fill Applications',
    description: 'Automatically fills out application forms with your information, saving hours of time.',
    icon: '⚡',
  },
  {
    title: 'Personalized Cover Letters',
    description: 'ML generates tailored cover letters for each application based on the job requirements.',
    icon: '✍️',
  },
  {
    title: 'Application Tracking',
    description: 'Track all your applications in one place and get notified about status updates.',
    icon: '📊',
  },
]

const Features = () => {
  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to streamline your job search</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

