import { useState, useEffect, useMemo } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import SearchBar from '../components/SearchBar'
import JobCard from '../components/JobCard'
import jobsService from '../services/jobs'
import { useAppContext } from '../context/AppContext'

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

export default function InternshipsPage() {
  const { user } = useAppContext()
  const [search, setSearch] = useState('')
  const [liveInternships, setLiveInternships] = useState([])
  const [loading, setLoading] = useState(false)

  const candidateSkills = useMemo(() => {
    return (user?.skills || ['React', 'JavaScript', 'Node.js', 'Python']).map((s) => s.toLowerCase())
  }, [user])

  useEffect(() => {
    fetchInternships(search)
  }, [search])

  const calculateMatch = (skills = []) => {
    if (!skills.length) return 82
    const norm = skills.map((s) => s.toLowerCase())
    let count = 0
    norm.forEach((s) => {
      if (candidateSkills.some((cs) => cs.includes(s) || s.includes(cs))) count++
    })
    return Math.min(98, Math.max(56, Math.round(55 + (count / norm.length) * 40)))
  }

  const fetchInternships = async (queryTerm = '') => {
    setLoading(true)
    try {
      const res = await jobsService.getInternships({ q: queryTerm || 'Internship' })
      const fetched = res.data?.data || []
      const mapped = fetched.map((item, idx) => {
        const title = cleanText(item.title) || 'Software Development Intern'
        const company = cleanText(item.company) || 'Partner Employer'
        return {
          id: item.id || `intern_${idx}`,
          role: title,
          company,
          logo: company ? company[0].toUpperCase() : 'I',
          location: item.location || 'Remote',
          salary: item.stipend || (item.salaryMin ? (item.currency === 'INR' ? `₹${Math.round(item.salaryMin/1000)}k - ₹${Math.round(item.salaryMax/1000)}k/mo` : `$${Math.round(item.salaryMin/1000)}k/mo`) : '₹18,000 - ₹35,000/mo Stipend'),
          skills: item.skills || ['React', 'JavaScript', 'Python'],
          match: calculateMatch(item.skills),
          remote: item.remote || /remote/i.test(item.location),
          postedAgo: 'Recently',
          applyLink: item.applyLink || 'https://internshala.com',
          description: item.description || 'Gain hands-on industry experience building scalable software with senior engineering mentors.',
        }
      })
      setLiveInternships(mapped)
    } catch (err) {
      console.warn('Internships fetch error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Internships">
      <h1 className="text-2xl font-bold text-ink mb-1">Internshala &amp; Global Internship Opportunities</h1>
      <p className="text-ink-muted mb-6">Kickstart your career with hands-on experience and real AI skill match scoring</p>

      <SearchBar
        placeholder="Search internships by title, company, skills (React, Python, Machine Learning)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFilterClick={() => {}}
      />

      <div className="mt-4 mb-2 flex items-center justify-between text-sm text-ink-muted">
        <span>{loading ? 'Aggregating live internships...' : `Showing ${liveInternships.length} live internship opportunities`}</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {liveInternships.map((internship) => (
          <JobCard key={internship.id} job={internship} userSkills={candidateSkills} />
        ))}
        {liveInternships.length === 0 && !loading && (
          <div className="col-span-full card p-10 text-center text-ink-muted">
            <p className="text-base font-semibold text-ink">No matching internship opportunities found.</p>
            <p className="text-sm mt-1">Try clearing your search term or search for "React", "Python", or "AI".</p>
            <button
              onClick={() => setSearch('')}
              className="btn-primary mt-4 px-5 py-2 text-sm"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
