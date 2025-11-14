import './Features.css'
import ScrollAnimation from './ScrollAnimation'

interface Feature {
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    title: 'Document Upload & Vectorization',
    description: 'Upload your CV, resume, reference letters, or university thesis. All documents are vectorized in our database for the RAG model to extract your personal expertise and experience.',
    icon: '📄',
  },
  {
    title: 'Multi-Source Job Search',
    description: 'Search for jobs from 6+ different sources including LinkedIn, Indeed, and more. Find the perfect opportunities all in one place.',
    icon: '🔍',
  },
  {
    title: 'AI-Powered Cover Letter Generation',
    description: 'Generate custom cover letters for each job application. Our RAG model incorporates your personal expertise and experience to create authentic, tailored content.',
    icon: '✨',
  },
  {
    title: 'Professional PDF Templates',
    description: 'Choose from multiple professional PDF templates to format your cover letter. Each template is designed to make a great first impression.',
    icon: '🎨',
  },
  {
    title: 'One-Click Job Applications',
    description: 'Apply for jobs directly from our platform. Get redirected to the company\'s application page with your personalized cover letter ready.',
    icon: '🚀',
  },
  {
    title: 'Application Dashboard',
    description: 'Track all your job applications in one centralized dashboard. Update the state and stage for each application to stay organized.',
    icon: '📊',
  },
]

const Features = () => {
  return (
    <section id="features" className="features">
      <div className="container">
        <ScrollAnimation className="scroll-slide-up">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to streamline your job application process</p>
          </div>
        </ScrollAnimation>
        <div className="features-grid">
          {features.map((feature, index) => (
            <ScrollAnimation 
              key={index} 
              delay={index * 100}
              className="scroll-scale"
            >
              <div className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

