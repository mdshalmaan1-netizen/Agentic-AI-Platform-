import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineMapPin, HiOutlineBookmark, HiBookmark, HiOutlineClock, HiOutlineXMark, HiOutlineCheckCircle, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2'
import applicationsService from '../services/applications'

const cleanText = (str) => {
  if (!str) return ''
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[^\x00-\x7F]+/g, '')
    .trim()
}

export default function JobCard({ job, compact = false, userSkills = [] }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)

  const cleanRole = cleanText(job.role) || 'Software Opportunity'
  const cleanCompany = cleanText(job.company) || 'Verified Tech Partner'
  const cleanDesc = cleanText(job.description) || 'No detailed description available for this listing.'

  // Direct target live URL on Internshala / Naukri web app
  const targetUrl = job.applyLink || 'https://internshala.com/internships/'

  const handleOpenJobPage = (e) => {
    e?.stopPropagation()
    navigate(`/jobs/${job.id || 'zoho-201'}`, { state: { job } })
  }

  const handleApplyToExternalSite = async (e) => {
    e?.stopPropagation()
    setApplying(true)
    try {
      // 1. Save application to Database (MongoDB / PostgreSQL) & update tracker
      await applicationsService.applyToJob({
        jobId: job.id,
        role: cleanRole,
        company: cleanCompany,
        location: job.location,
        salary: job.salary,
        match: job.match,
        applyLink: targetUrl,
      })
    } catch (err) {
      console.warn('Backend application save fallback active:', err.message)
    } finally {
      setApplying(false)
      setApplied(true)
      // 2. Directly open live target URL on internshala.com in a new browser tab!
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const matchColor = (job.match || 75) > 85 ? 'bg-forest-50 text-forest-700 border-forest-200' : (job.match || 75) > 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200'

  return (
    <>
      <div className="card p-5 hover:shadow-soft transition-all flex flex-col justify-between group">
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="w-11 h-11 rounded-xl bg-forest-100 text-forest-700 font-bold flex items-center justify-center shrink-0 text-lg group-hover:bg-forest-600 group-hover:text-white transition-colors">
                {cleanCompany[0]?.toUpperCase() || 'C'}
              </span>
              <div>
                <h3 className="font-semibold text-ink leading-tight group-hover:text-forest-600 transition-colors">{cleanRole}</h3>
                <p className="text-sm text-ink-muted">{cleanCompany}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSaved((s) => !s)
              }}
              className="text-ink-muted hover:text-forest-600 transition-colors"
            >
              {saved ? <HiBookmark className="text-lg text-forest-600" /> : <HiOutlineBookmark className="text-lg" />}
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1"><HiOutlineMapPin /> {job.location || 'Remote'}</span>
            {job.postedAgo && <span className="flex items-center gap-1"><HiOutlineClock /> {job.postedAgo}</span>}
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-semibold text-forest-700">{job.salary || 'Competitive Stipend/Salary'}</span>
            {job.match && (
              <span className={`badge border ${matchColor} font-bold px-2.5 py-1`}>
                {job.match}% Match
              </span>
            )}
          </div>

          {!compact && job.skills && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {job.skills.slice(0, 6).map((s) => (
                <span key={s} className="badge bg-cream-dark text-ink-light text-[11px] font-medium">{cleanText(s)}</span>
              ))}
            </div>
          )}
        </div>

        {!compact && (
          <div className="flex gap-2 mt-5">
            {applied ? (
              <button
                onClick={handleApplyToExternalSite}
                className="bg-forest-100 text-forest-700 border border-forest-300 font-semibold flex-1 py-2 text-xs rounded-lg flex items-center justify-center gap-1"
              >
                <HiOutlineCheckCircle /> ✓ Applied (Re-open Link)
              </button>
            ) : (
              <button
                onClick={handleApplyToExternalSite}
                disabled={applying}
                className="btn-primary flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {applying ? 'Opening...' : 'Apply on Internshala'} <HiOutlineArrowTopRightOnSquare className="text-xs" />
              </button>
            )}
            <button
              onClick={handleOpenJobPage}
              className="btn-secondary flex-1 py-2 text-xs"
            >
              View Summary
            </button>
          </div>
        )}
      </div>

      {/* Modal for View Details fallback */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[85vh] overflow-y-auto relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-ink-muted hover:text-ink text-xl p-1"
            >
              <HiOutlineXMark />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 rounded-xl bg-forest-600 text-white font-bold flex items-center justify-center text-xl">
                {cleanCompany[0]?.toUpperCase() || 'C'}
              </span>
              <div>
                <h2 className="text-xl font-bold text-ink">{cleanRole}</h2>
                <p className="text-sm text-forest-600 font-medium">{cleanCompany} · {job.location || 'Remote'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-y border-border my-4 text-sm">
              <div>
                <p className="text-xs text-ink-muted">Compensation</p>
                <p className="font-semibold text-ink">{job.salary || 'Competitive'}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-ink-muted">AI Match Score</p>
                <p className="font-semibold text-forest-600">{job.match}% Resume Alignment</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-ink-muted">Job Type</p>
                <p className="font-semibold text-ink">{job.type || 'Full Time'}</p>
              </div>
            </div>

            {applied && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <HiOutlineCheckCircle className="text-emerald-600 text-base" />
                <span>🎉 Application Submitted &amp; Saved to Database! Status set to "Applied".</span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-bold text-sm text-ink mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {(job.skills || []).map((s) => (
                  <span key={s} className="badge bg-forest-50 text-forest-700 font-medium">{cleanText(s)}</span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-sm text-ink mb-2">Job Description</h3>
              <p className="text-sm text-ink-light leading-relaxed whitespace-pre-line">{cleanDesc}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApplyToExternalSite}
                disabled={applying}
                className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 text-xs"
              >
                Apply Direct on Internshala Website <HiOutlineArrowTopRightOnSquare />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
