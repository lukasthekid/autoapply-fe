import { useState } from 'react'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>AutoApply</h1>
          </div>
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <a href="#features">Features</a>
            <a href="#templates">Templates</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
            <button className="btn-primary btn-glow">Get Started</button>
          </nav>
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

