import { HiSparkles } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

export default function Logo({ dark = false }) {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <span className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center">
        <HiSparkles className="text-white text-sm" />
      </span>
      <span className={`font-bold text-lg ${dark ? 'text-white' : 'text-ink'}`}>
        Agentic AI
      </span>
    </Link>
  )
}
