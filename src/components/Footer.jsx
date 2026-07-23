import Logo from './Logo'
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-forest-800 text-forest-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Logo dark />
          <p className="text-sm text-forest-200 mt-4 leading-relaxed">
            Discover jobs, internships and hackathons matched to your skills using AI agents.
          </p>
          <div className="flex gap-4 mt-5 text-lg">
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors"><FaLinkedin /></a>
            <a href="#" aria-label="GitHub" className="hover:text-white transition-colors"><FaGithub /></a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors"><FaTwitter /></a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-forest-200">
            <li><a href="/jobs" className="hover:text-white">Jobs</a></li>
            <li><a href="/internships" className="hover:text-white">Internships</a></li>
            <li><a href="/hackathons" className="hover:text-white">Hackathons</a></li>
            <li><a href="/assistant" className="hover:text-white">AI Assistant</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-forest-200">
            <li><a href="#about" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-forest-200">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-forest-700 py-5 text-center text-xs text-forest-300">
        © {new Date().getFullYear()} Agentic AI. All rights reserved.
      </div>
    </footer>
  )
}
