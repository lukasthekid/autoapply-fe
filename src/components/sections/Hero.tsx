import './Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Automate Your Job Applications with AI
          </h1>
          <p className="hero-subtitle">
            Let our ML-powered platform handle the tedious work of applying to jobs.
            Focus on what matters - landing your dream role.
          </p>
          <div className="hero-cta">
            <button className="btn-primary btn-large">Get Started Free</button>
            <button className="btn-secondary btn-large">Learn More</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

