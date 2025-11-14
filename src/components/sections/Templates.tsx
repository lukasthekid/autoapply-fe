import './Templates.css'

interface Template {
  name: string
  description: string
  image: string
}

const templates: Template[] = [
  {
    name: 'Simple Preavis',
    description: 'Clean and minimalist design perfect for modern industries',
    image: '/simple-preavis-0.1.0-small.webp',
  },
  {
    name: 'Formalettre',
    description: 'Professional and traditional format ideal for corporate roles',
    image: '/formalettre-0.3.0-small.webp',
  },
  {
    name: 'Fireside',
    description: 'Warm and approachable style great for creative positions',
    image: '/fireside-1.0.0-small.webp',
  },
]

const Templates = () => {
  return (
    <section id="templates" className="templates">
      <div className="container">
        <div className="section-header">
          <h2>Professional Cover Letter Templates</h2>
          <p>Choose from our collection of professionally designed PDF templates</p>
        </div>
        <div className="templates-grid">
          {templates.map((template, index) => (
            <div key={index} className="template-card">
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

