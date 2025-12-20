import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How does the AI document generation work?',
    answer: 'Our AI analyzes your resume, work history, and the job description to create personalized resumes and cover letters. It identifies key skills and experiences that match the job requirements and crafts compelling narratives that highlight your qualifications. Each document is unique and tailored to the specific position.',
  },
  {
    question: 'Can I edit the AI-generated documents?',
    answer: 'Absolutely! You have full control over every document. Use our integrated editor to make any changes you want. The AI provides a strong foundation, and you can customize it to match your personal style and add specific details.',
  },
  {
    question: 'How many documents can I generate with the free plan?',
    answer: 'The free plan includes 5 AI-generated documents per month (resumes or cover letters). This is perfect for testing the platform and applying to a few selected positions. If you need more, you can upgrade to Premium for unlimited document generation.',
  },
  {
    question: 'Is my data secure and private?',
    answer: 'Yes, security is our top priority. All your documents and personal information are encrypted and stored securely. We never share your data with third parties, and you have complete control over your information. You can delete your data at any time.',
  },
  {
    question: 'What file formats can I upload?',
    answer: 'We support all common document formats including PDF, DOCX, TXT, and more. You can upload resumes, portfolios, certificates, transcripts, and any other relevant documents to build your professional profile.',
  },
  {
    question: 'Can I cancel my Premium subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time with no questions asked. If you cancel, you\'ll continue to have Premium access until the end of your billing period, after which you\'ll be moved to the free plan.',
  },
  {
    question: 'How does the job search integration work?',
    answer: 'We aggregate job listings from major job boards like LinkedIn, Indeed, and others. You can search, filter, and save jobs directly in our platform. You can also manually add job postings you find elsewhere. Everything is organized in one place.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with Premium for any reason within the first 30 days, contact our support team for a full refund.',
  },
  {
    question: 'Can I use Resumr for international job applications?',
    answer: 'Yes! Resumr supports multiple languages and can generate resumes and cover letters for international positions. Our AI understands cultural nuances and can adapt the tone and style based on the target country and industry.',
  },
  {
    question: 'How is this different from using ChatGPT directly?',
    answer: 'While ChatGPT is a powerful tool, Resumr is specifically built for job applications. We provide templates, document management, application tracking, job search integration, and ATS optimization all in one platform. Plus, our AI is fine-tuned for resume and cover letter generation with best practices built in.',
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">FAQ</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Resumr
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              style={{
                animation: 'fadeIn 0.6s ease-out forwards',
                animationDelay: `${index * 0.05}s`,
                opacity: 0,
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@resumr.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
