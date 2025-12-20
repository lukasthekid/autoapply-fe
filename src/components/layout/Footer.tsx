import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
              <span className="text-2xl font-bold text-gray-900">Resumr</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-sm">
              AI-powered job application platform helping professionals land their dream jobs faster.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:support@resumr.com" className="p-2 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="text-gray-600 hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="text-gray-600 hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#privacy" className="text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-gray-600 hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-600 hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} Resumr. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>Made with ❤️ for job seekers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
