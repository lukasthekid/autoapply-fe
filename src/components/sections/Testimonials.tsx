import './Testimonials.css'
import ScrollAnimation from './ScrollAnimation'

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Tech Corp',
    content: 'AutoApply transformed my job search. The AI-generated cover letters are incredibly personalized and saved me hours of work. I landed 3 interviews in my first week!',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager',
    company: 'StartupXYZ',
    content: 'The RAG technology is impressive - it actually uses my real experience from my uploaded documents. No generic templates, just authentic content that gets results.',
  },
  {
    name: 'Emily Johnson',
    role: 'Data Scientist',
    company: 'DataFlow Inc',
    content: 'Being able to search jobs from multiple sources and generate tailored cover letters in minutes is a game-changer. The dashboard keeps me organized throughout the entire process.',
  },
  {
    name: 'David Kim',
    role: 'Frontend Developer',
    company: 'WebStudio',
    content: 'I love the professional templates! Each cover letter looks polished and professional. The one-click application feature makes the whole process seamless.',
  },
  {
    name: 'Lisa Anderson',
    role: 'Marketing Manager',
    company: 'BrandCo',
    content: 'As someone switching careers, AutoApply helped me highlight relevant experience from my past roles. The AI understands context and creates compelling narratives.',
  },
  {
    name: 'James Wilson',
    role: 'DevOps Engineer',
    company: 'CloudTech',
    content: 'The document vectorization feature is brilliant. I uploaded my thesis and reference letters, and the system incorporated insights I never would have thought to include.',
  },
]

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <ScrollAnimation className="scroll-slide-up">
          <div className="section-header">
            <h2>What Our Users Are Saying</h2>
            <p>Join thousands of professionals who have streamlined their job search</p>
          </div>
        </ScrollAnimation>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimation 
              key={index} 
              delay={index * 100}
              className="scroll-blur"
            >
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="testimonial-info">
                    <div className="testimonial-name">{testimonial.name}</div>
                    <div className="testimonial-role">
                      {testimonial.role} @ {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

