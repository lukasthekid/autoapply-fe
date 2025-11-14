import './Templates.css'
import ScrollAnimation from './ScrollAnimation'

interface Template {
  name: string
  description: string
  image: string
}

const templates: Template[] = [
  {
    name: 'Simple Preavis',
    description: 'Clean and minimalist design perfect for modern industries',
    image: '/simple-preavis.png',
  },
  {
    name: 'Formalettre',
    description: 'Professional and traditional format ideal for corporate roles',
    image: '/formalettre.png',
  },
  {
    name: 'Fireside',
    description: 'Warm and approachable style great for creative positions',
    image: '/fireside.png',
  },
  {
    name: 'Letter Pro',
    description: 'DIN 5008 compliant professional letter template for formal correspondence',
    image: '/letter-pro.png',
  },
]

const Templates = () => {
  // Duplicate templates multiple times for seamless infinite loop
  // We need enough duplicates to ensure smooth scrolling in both directions
  const duplicatedTemplates = [...templates, ...templates, ...templates, ...templates]

  return (
    <section id="templates" className="templates">
      <div className="container">
        <ScrollAnimation className="scroll-slide-up">
          <div className="section-header">
            <h2>Professional Cover Letter Templates</h2>
            <p>Choose from our collection of professionally designed PDF templates</p>
          </div>
        </ScrollAnimation>
      </div>
      <div className="templates-carousel-wrapper">
        <div className="templates-carousel">
          {duplicatedTemplates.map((template, index) => (
            <div key={`${template.name}-${index}`} className="template-card">
              <div className="template-image-wrapper">
                <img src={template.image} alt={template.name} className="template-image" />
              </div>
              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Templates

