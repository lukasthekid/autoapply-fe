import { Star, Quote } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  company: string
  image: string
  quote: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    image: '/Sarah Chen.png',
    quote: 'Resumr cut my application time from 2 hours to 5 minutes per job. I applied to 50 positions in a week and landed 3 interviews. The AI-generated resumes are spot-on!',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager',
    company: 'Microsoft',
    image: '/Michael Rodriguez.png',
    quote: 'The AI-generated documents are incredibly personalized. Recruiters commented on how well-tailored my applications were. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Emily Johnson',
    role: 'Marketing Director',
    company: 'Amazon',
    image: '/Emily Johnson.png',
    quote: 'Finally, a tool that understands the job search grind. The tracking dashboard alone is worth it. Everything I need in one place.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Data Scientist',
    company: 'Meta',
    image: '/David Kim.png',
    quote: 'I was skeptical about AI-written resumes, but the quality exceeded my expectations. Each one felt authentic and relevant to the job.',
    rating: 5,
  },
  {
    name: 'Lisa Anderson',
    role: 'UX Designer',
    company: 'Apple',
    image: '/Lisa Anderson.png',
    quote: 'The professional templates and smart editor give me complete control. Beautiful documents that stand out from generic applications.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Business Analyst',
    company: 'Tesla',
    image: '/James Wilson.png',
    quote: 'Went from sending 5 applications a week to 30+. My interview rate tripled. This platform is a must-have for serious job seekers.',
    rating: 5,
  },
]

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
            <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">Testimonials</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Loved by Job Seekers Everywhere
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of professionals who landed their dream jobs with Resumr
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              style={{
                animation: 'fadeIn 0.6s ease-out forwards',
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
              }}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-10 h-10 text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                  onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=4f46e5&color=fff`
                  }}
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-white rounded-full shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">4.9</span>
              <span className="text-gray-600">out of 5</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-gray-600">
              Based on <span className="font-semibold text-gray-900">2,000+</span> reviews
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
