import { HiOutlineCalendarDays, HiOutlineMapPin, HiOutlineUserGroup, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2'

export default function HackathonCard({ hackathon }) {
  const handleRegister = (e) => {
    e?.stopPropagation()
    const targetUrl = hackathon.link || 'https://devpost.com/hackathons'
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="card overflow-hidden hover:shadow-soft transition-shadow flex flex-col justify-between border border-border">
      <div>
        <div className={`h-32 bg-gradient-to-br ${hackathon.banner || 'from-forest-500 to-forest-700'} relative p-4 flex items-start justify-between`}>
          <span className="badge bg-white/90 text-forest-700 font-bold uppercase text-[10px] tracking-wider shadow-sm">
            {hackathon.platform || 'Devpost'}
          </span>
          <span className="badge bg-black/40 backdrop-blur-sm text-white font-semibold uppercase text-[10px]">
            {hackathon.status || 'Active'}
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-ink text-base leading-snug">{hackathon.name}</h3>
          <p className="text-xs text-forest-600 font-medium mt-1">{hackathon.organizer}</p>

          <div className="mt-4 space-y-2 text-xs text-ink-muted">
            <p className="text-sm font-bold text-forest-700">Prize Pool: {hackathon.prizePool || '$10,000 USD'}</p>
            <p className="flex items-center gap-1.5 text-ink-light"><HiOutlineCalendarDays className="text-forest-600 text-sm" /> {hackathon.dateRange}</p>
            <p className="flex items-center gap-1.5 text-ink-light"><HiOutlineMapPin className="text-forest-600 text-sm" /> {hackathon.location || 'Online'}</p>
            <p className="flex items-center gap-1.5 text-ink-light"><HiOutlineUserGroup className="text-forest-600 text-sm" /> {hackathon.teamSize || '1-4 Members'}</p>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={handleRegister}
          className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 shadow-sm font-semibold hover:bg-forest-700"
        >
          Go to Registration Page <HiOutlineArrowTopRightOnSquare className="text-base" />
        </button>
      </div>
    </div>
  )
}
