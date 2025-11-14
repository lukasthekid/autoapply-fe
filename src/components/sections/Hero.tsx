import './Hero.css'
import { useScrollTo } from '@/hooks/useScrollTo'

const Hero = () => {
  const { scrollTo } = useScrollTo()

  return (
    <section className="hero">
      <div className="hero-ambient-glow hero-ambient-glow-1" />
      <div className="hero-ambient-glow hero-ambient-glow-2" />
      <div className="hero-ambient-glow hero-ambient-glow-3" />
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span>AI-Powered Cover Letter Generator</span>
          </div>
          <h1 className="hero-title">
            Generate Perfect Cover Letters with AI
          </h1>
          <p className="hero-subtitle">
            Upload your documents, search jobs from 6+ sources, and generate personalized cover letters 
            tailored to each application. Powered by RAG technology for authentic, experience-based content.
          </p>
          <div className="hero-cta">
            <button className="btn-primary btn-large btn-glow">Get Started Free</button>
            <button 
              className="btn-secondary btn-large btn-glow-secondary"
              onClick={() => scrollTo('pricing')}
            >
              View Pricing
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">6+</div>
              <div className="stat-label">Job Sources</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">AI-Powered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Applications</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

