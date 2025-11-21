import { useState, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import './FAQ.css'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How does the AI cover letter generation work?',
    answer: 'Our platform uses RAG (Retrieval-Augmented Generation) technology. You upload your documents (CV, resume, reference letters, etc.), which are vectorized and stored in our database. When generating a cover letter, the AI retrieves relevant information from your documents and creates personalized content that matches the job requirements.',
  },
  {
    question: 'What file formats can I upload?',
    answer: 'You can upload text files (.txt), Word documents (.doc, .docx), and PDF files (.pdf). We support common document types including CVs, resumes, reference letters, university theses, and other professional documents.',
  },
  {
    question: 'Which job sources do you support?',
    answer: 'We scrape jobs from 6+ major sources including LinkedIn, Indeed, and other popular job boards. Our platform aggregates opportunities from multiple sources so you can search and apply from one central location.',
  },
  {
    question: 'Can I customize the generated cover letters?',
    answer: 'Yes! After the AI generates your cover letter, you can review and edit it before applying. You can also select from multiple professional PDF templates to format your cover letter exactly how you want it.',
  },
  {
    question: 'How secure is my data?',
    answer: 'We take data security seriously. All your documents are encrypted and stored securely. Your personal information is only used to generate cover letters and is never shared with third parties. You can delete your data at any time from your dashboard.',
  },
  {
    question: 'What happens if I exceed my free plan limits?',
    answer: 'If you reach your monthly limit on the free plan, you can upgrade to the Pro plan for unlimited cover letters and features. Alternatively, you can wait until the next month when your limits reset.',
  },
  {
    question: 'Can I track my application status?',
    answer: 'Yes! Our application dashboard allows you to track all your job applications in one place. You can update the state and stage for each application (e.g., Applied, Interview, Offer, Rejected) to stay organized throughout your job search.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with the Pro plan, contact us within 30 days of your purchase for a full refund, no questions asked.',
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null) // All collapsed initially
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true,
  })
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (hasIntersected) {
      setTimeout(() => {
        setIsAnimated(true)
      }, 200)
    }
  }, [hasIntersected])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="faq" ref={elementRef as React.RefObject<HTMLElement>}>
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about AutoApply</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'faq-item-open' : ''} ${isAnimated ? 'animate-in' : ''}`}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <svg
                  className="faq-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ

