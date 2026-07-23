import { useState } from 'react'
import { HiOutlineMagnifyingGlass, HiOutlineBell, HiOutlineEnvelope } from 'react-icons/hi2'
import { useAppContext } from '../context/AppContext'

export default function TopNavbar({ title }) {
  const { user } = useAppContext()
  const [imgError, setImgError] = useState(false)

  const candidateName = user?.name || 'Candidate'
  const initial = candidateName.charAt(0).toUpperCase() || 'C'
  const avatarUrl = user?.photoUrl || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&background=1B4332&color=fff`

  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          placeholder="Search for jobs, internships, hackathons..."
          className="input-field pl-10 bg-white"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-cream-dark transition-colors">
          <HiOutlineEnvelope className="text-lg text-ink-light" />
        </button>
        <button className="relative w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-cream-dark transition-colors">
          <HiOutlineBell className="text-lg text-ink-light" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          {!imgError ? (
            <img
              src={avatarUrl}
              alt={candidateName}
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-full object-cover border border-forest-200 shadow-sm"
            />
          ) : (
            <span className="w-9 h-9 rounded-full bg-forest-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {initial}
            </span>
          )}
          <span className="text-sm font-semibold text-ink hidden sm:block truncate max-w-[140px]">{candidateName}</span>
        </div>
      </div>
    </header>
  )
}
