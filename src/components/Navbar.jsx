import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import Button from './Button'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Internships', to: '/internships' },
  { label: 'Hackathons', to: '/hackathons' },
  { label: 'Resources', to: '/#features' },
  { label: 'About', to: '/#about' },
]

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Logo />
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-light">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-forest-700 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-ink hover:text-forest-700 transition-colors px-3"
          >
            Log in
          </button>
          <Button onClick={() => navigate('/register')}>Sign up</Button>
        </div>
      </nav>
    </header>
  )
}
