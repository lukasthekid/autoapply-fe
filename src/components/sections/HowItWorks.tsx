import './HowItWorks.css'

interface Step {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '1',
    title: 'Create Your Profile',
    description: 'Upload your resume and fill in your professional details. Our AI will learn your preferences.',
  },
  {
    number: '2',
    title: 'Set Your Preferences',
    description: 'Define job criteria like location, salary range, and industry. We\'ll find the perfect matches.',
  },
  {
    number: '3',
    title: 'Let AI Do the Work',
    description: 'Our ML engine automatically finds jobs, customizes applications, and submits them for you.',
  },
  {
    number: '4',
    title: 'Track & Optimize',
    description: 'Monitor your applications, get insights, and continuously improve your success rate.',
  },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in minutes, not hours</p>
        </div>
        <div className="steps">
          {steps.map((step, index) => (
            <div key={index} className="step">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

