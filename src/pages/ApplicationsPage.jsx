import { useState, useEffect } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import applicationsService from '../services/applications'
import { HiOutlineXMark, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2'

const statusStyles = {
  Applied: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  'In Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Interview: 'bg-forest-50 text-forest-700 border-forest-200',
  Shortlisted: 'bg-purple-50 text-purple-700 border-purple-200',
  Rejected: 'bg-red-50 text-red-600 border-red-200',
}

const statCards = [
  { label: 'Applied', key: 'applied', tint: 'text-ink' },
  { label: 'In Review', key: 'inReview', tint: 'text-amber-600' },
  { label: 'Interview', key: 'interview', tint: 'text-forest-700' },
  { label: 'Shortlisted', key: 'shortlisted', tint: 'text-purple-600' },
  { label: 'Rejected', key: 'rejected', tint: 'text-red-500' },
]

export default function ApplicationsPage() {
  const [appsList, setAppsList] = useState([])
  const [stats, setStats] = useState({ applied: 0, inReview: 0, interview: 0, shortlisted: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    fetchLiveApplications()
  }, [])

  const fetchLiveApplications = async () => {
    setLoading(true)
    try {
      const res = await applicationsService.getApplications()
      const data = res.data?.data || {}
      const list = data.applications || []
      const liveStats = data.stats || {
        applied: list.filter((a) => a.status === 'Applied').length,
        inReview: list.filter((a) => a.status === 'In Review').length,
        interview: list.filter((a) => a.status === 'Interview').length,
        shortlisted: list.filter((a) => a.status === 'Shortlisted').length,
        rejected: list.filter((a) => a.status === 'Rejected').length,
      }
      setAppsList(list)
      setStats(liveStats)
    } catch (err) {
      console.warn('Applications fetch fallback active:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationsService.updateStatus(appId, newStatus)
      setAppsList((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      )
      if (selectedApp?.id === appId) {
        setSelectedApp((prev) => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      console.warn('Status update fallback:', err.message)
    }
  }

  return (
    <DashboardLayout title="Application Tracker">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Live Application Tracker</h1>
          <p className="text-ink-muted text-sm mt-1">Real-time status updates connected directly to Backend & Database API</p>
        </div>
        <button onClick={fetchLiveApplications} className="btn-secondary text-xs py-2 px-3 self-start sm:self-auto">
          ↻ Refresh Status
        </button>
      </div>

      {/* Live Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.key} className="card p-5 text-center">
            <p className={`text-2xl font-bold ${s.tint}`}>{stats[s.key] || 0}</p>
            <p className="text-xs text-ink-muted mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Live Applications Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-ink">Tracked Applications ({appsList.length})</h2>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live DB Sync Active
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-muted border-b border-border bg-cream/40">
                <th className="px-5 py-3 font-medium">Job / Internship Title</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Application Status</th>
                <th className="px-5 py-3 font-medium">Applied On</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-ink-muted">
                    Loading your live applications from API gateway...
                  </td>
                </tr>
              ) : appsList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-ink-muted">
                    No applications submitted yet. Browse jobs/internships and click <strong>1-Click Direct Application</strong>.
                  </td>
                </tr>
              ) : (
                appsList.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-cream-dark/40 transition-colors">
                    <td className="px-5 py-4 font-semibold text-ink">{app.role}</td>
                    <td className="px-5 py-4 text-ink-light font-medium">{app.company}</td>
                    <td className="px-5 py-4 text-ink-muted text-xs">{app.location || 'Remote'}</td>
                    <td className="px-5 py-4">
                      <span className={`badge border ${statusStyles[app.status] || 'bg-slate-50 text-slate-700'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink-muted text-xs">{app.appliedOn || 'Recently'}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-forest-600 font-semibold hover:underline text-xs"
                      >
                        View Status &amp; Timeline
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-xl">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute right-4 top-4 text-ink-muted hover:text-ink text-xl p-1"
            >
              <HiOutlineXMark />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 rounded-xl bg-forest-600 text-white font-bold flex items-center justify-center text-xl">
                {selectedApp.company?.[0]?.toUpperCase() || 'A'}
              </span>
              <div>
                <h2 className="text-xl font-bold text-ink">{selectedApp.role}</h2>
                <p className="text-sm text-forest-600 font-medium">{selectedApp.company} · {selectedApp.location}</p>
              </div>
            </div>

            <div className="p-4 bg-cream/60 rounded-xl border border-border mb-5">
              <div className="flex justify-between text-xs text-ink-muted mb-1">
                <span>Current Status</span>
                <span className="font-bold text-forest-700">{selectedApp.status}</span>
              </div>
              <p className="text-xs text-ink-light">Stipend / Salary: <strong>{selectedApp.salary}</strong></p>
              {selectedApp.match && (
                <p className="text-xs text-forest-600 mt-1 font-semibold">AI Resume Fit Match: {selectedApp.match}%</p>
              )}
            </div>

            {/* Application Progress Timeline */}
            <h3 className="font-bold text-sm text-ink mb-3">Application Progress Timeline</h3>
            <div className="space-y-3 mb-6">
              {(selectedApp.timeline || [
                { step: 'Application Submitted', date: selectedApp.appliedOn || 'Recently', done: true },
                { step: 'HR Screening & AI Match Assessment', date: 'In Progress', done: selectedApp.status !== 'Applied' },
                { step: 'Technical Interview Round', date: 'Upcoming', done: selectedApp.status === 'Interview' || selectedApp.status === 'Shortlisted' },
                { step: 'Final Offer / Selection', date: 'Pending', done: selectedApp.status === 'Shortlisted' },
              ]).map((t, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  {t.done ? (
                    <HiOutlineCheckCircle className="text-lg text-emerald-600 shrink-0" />
                  ) : (
                    <HiOutlineClock className="text-lg text-ink-muted shrink-0" />
                  )}
                  <div className="flex-1 flex justify-between">
                    <span className={t.done ? 'font-semibold text-ink' : 'text-ink-muted'}>{t.step}</span>
                    <span className="text-ink-muted">{t.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Update Status Actions */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-semibold text-ink mb-2">Simulate Status Update:</p>
              <div className="flex flex-wrap gap-2">
                {['In Review', 'Interview', 'Shortlisted', 'Rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedApp.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedApp.status === st ? 'bg-forest-600 text-white border-forest-600' : 'bg-white text-ink-light border-border hover:bg-cream'
                    }`}
                  >
                    Set {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedApp(null)} className="btn-secondary px-5 py-2 text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
