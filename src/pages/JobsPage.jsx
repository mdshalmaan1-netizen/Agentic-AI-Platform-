import { useState, useEffect, useMemo } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import SearchBar from '../components/SearchBar'
import JobCard from '../components/JobCard'
import jobsService from '../services/jobs'
import { useAppContext } from '../context/AppContext'

const locations = ['Chennai', 'Coimbatore', 'Bangalore', 'Hyderabad', 'Mumbai', 'Remote (India)']
const experiences = ['0-1 years', '1-3 years', '3-5 years', 'Internship']

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

export default function JobsPage() {
  const { user } = useAppContext()
  const [search, setSearch] = useState('')
  const [selectedLocations, setSelectedLocations] = useState([])
  const [selectedExperience, setSelectedExperience] = useState([])
  const [salaryMax, setSalaryMax] = useState(30)
  const [liveJobs, setLiveJobs] = useState([])
  const [loading, setLoading] = useState(false)

  const candidateSkills = useMemo(() => {
    return (user?.skills || ['React', 'JavaScript', 'Node.js', 'PostgreSQL']).map((s) => s.toLowerCase())
  }, [user])

  useEffect(() => {
    fetchJobs(search)
  }, [search])

  const calculateDynamicMatch = (jobSkills = [], jobTitle = '', jobDesc = '') => {
    if (!jobSkills || jobSkills.length === 0) return 76

    const normalizedJobSkills = jobSkills.map((s) => s.toLowerCase())
    const fullText = (jobTitle + ' ' + jobDesc).toLowerCase()

    let matchCount = 0
    normalizedJobSkills.forEach((js) => {
      if (candidateSkills.some((cs) => cs.includes(js) || js.includes(cs) || fullText.includes(cs))) {
        matchCount++
      }
    })

    const ratio = matchCount / Math.max(normalizedJobSkills.length, 1)
    const score = Math.min(98, Math.max(52, Math.round(52 + ratio * 44 + (jobTitle.toLowerCase().includes('react') ? 10 : 0))))
    return score
  }

  const formatSalary = (j) => {
    if (j.stipend) return j.stipend
    if (j.currency === 'INR' && j.salaryMin) {
      if (j.salaryMin >= 100000) {
        return `₹${(j.salaryMin / 100000).toFixed(1)}L - ₹${(j.salaryMax / 100000).toFixed(1)}L / yr`
      }
      return `₹${Math.round(j.salaryMin / 1000)}k - ₹${Math.round(j.salaryMax / 1000)}k / mo`
    }
    if (j.salaryMin) return `$${Math.round(j.salaryMin / 1000)}k - $${Math.round(j.salaryMax / 1000)}k`
    return 'Competitive Stipend/Salary'
  }

  const fetchJobs = async (queryTerm = '') => {
    setLoading(true)
    try {
      const res = await jobsService.getJobs({ q: queryTerm || 'Developer' })
      const fetched = res.data?.data || []
      const mapped = fetched.map((j, idx) => {
        const cleanTitle = cleanText(j.title)
        const cleanComp = cleanText(j.company)
        const calculatedMatch = calculateDynamicMatch(j.skills, cleanTitle, j.description)

        return {
          id: j.id || `job_${idx}`,
          role: cleanTitle,
          company: cleanComp,
          logo: cleanComp ? cleanComp[0].toUpperCase() : 'T',
          location: j.location || 'Remote',
          salary: formatSalary(j),
          skills: j.skills || ['React', 'Node.js'],
          match: j.matchPercentage || calculatedMatch,
          remote: j.remote || /remote/i.test(j.location),
          experience: j.experience || '1-3 years',
          type: j.type || 'FULL_TIME',
          postedAgo: 'Recently',
          applyLink: j.applyLink,
          description: j.description,
          aiSuggestion: j.aiSuggestion,
        }
      })
      setLiveJobs(mapped)
    } catch (err) {
      console.warn('Jobs fetch error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const filteredJobs = useMemo(() => {
    return liveJobs.filter((j) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        !search ||
        j.role.toLowerCase().includes(searchLower) ||
        j.company.toLowerCase().includes(searchLower) ||
        j.skills.some((s) => s.toLowerCase().includes(searchLower)) ||
        (searchLower.includes('intern') && (j.experience?.toLowerCase().includes('intern') || j.type === 'INTERNSHIP' || j.role?.toLowerCase().includes('intern')))

      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.some((loc) => {
          const locLower = loc.toLowerCase()
          if (locLower.includes('remote')) return j.remote || /remote/i.test(j.location)
          if (locLower.includes('chennai')) return /chennai/i.test(j.location)
          if (locLower.includes('coimbatore')) return /coimbatore/i.test(j.location)
          if (locLower.includes('bangalore')) return /bangalore/i.test(j.location)
          if (locLower.includes('hyderabad')) return /hyderabad/i.test(j.location)
          if (locLower.includes('mumbai')) return /mumbai/i.test(j.location)
          return j.location.toLowerCase().includes(locLower)
        })

      const matchesExperience =
        selectedExperience.length === 0 ||
        selectedExperience.some((exp) => j.experience.toLowerCase().includes(exp.toLowerCase()) || (exp.toLowerCase().includes('intern') && j.type === 'INTERNSHIP'))

      return matchesSearch && matchesLocation && matchesExperience
    })
  }, [liveJobs, search, selectedLocations, selectedExperience])

  return (
    <DashboardLayout title="Smart Jobs &amp; Opportunities Aggregator">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Active Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ink">Active Filters</h2>
              <button
                className="text-xs text-forest-600 font-medium hover:underline"
                onClick={() => {
                  setSelectedLocations([])
                  setSelectedExperience([])
                  setSalaryMax(30)
                  setSearch('')
                }}
              >
                Clear all
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-ink mb-3">Location</p>
              <div className="space-y-2">
                {locations.map((loc) => (
                  <label key={loc} className="flex items-center gap-2 text-sm text-ink-light cursor-pointer hover:text-ink">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => toggle(selectedLocations, setSelectedLocations, loc)}
                      className="rounded border-border text-forest-600 focus:ring-forest-500"
                    />
                    {loc}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-ink mb-3">Experience Level</p>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <label key={exp} className="flex items-center gap-2 text-sm text-ink-light cursor-pointer hover:text-ink">
                    <input
                      type="checkbox"
                      checked={selectedExperience.includes(exp)}
                      onChange={() => toggle(selectedExperience, setSelectedExperience, exp)}
                      className="rounded border-border text-forest-600 focus:ring-forest-500"
                    />
                    {exp}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-ink mb-3">Salary Range</p>
              <input
                type="range"
                min="0"
                max="30"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                className="w-full accent-forest-600"
              />
              <div className="flex justify-between text-xs text-ink-muted mt-1">
                <span>₹0</span>
                <span>₹{salaryMax * 2}k+/mo</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Job Listings */}
        <div className="flex-1 min-w-0">
          <SearchBar
            placeholder="Search jobs by role, skills, company (Adzuna, Jooble, RemoteOK, Naukri, Internshala)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFilterClick={() => {}}
          />
          <div className="flex items-center justify-between mt-4 mb-4">
            <p className="text-sm text-ink-muted font-medium">
              {loading ? 'Aggregating live job listings &amp; computing AI fit...' : `Showing ${filteredJobs.length} live matching jobs`}
            </p>
            <select className="input-field w-auto text-sm">
              <option>AI Skill Fit Rank</option>
              <option>Newest Listings</option>
              <option>Salary: High to Low</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} userSkills={candidateSkills} />
            ))}
            {filteredJobs.length === 0 && !loading && (
              <div className="col-span-2 card p-10 text-center text-ink-muted">
                <p className="text-base font-semibold text-ink">No matching jobs found with current filters.</p>
                <p className="text-sm mt-1">Try clearing location or experience filters, or search for "Developer".</p>
                <button
                  onClick={() => { setSelectedLocations([]); setSelectedExperience([]); setSearch(''); }}
                  className="btn-primary mt-4 px-5 py-2 text-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
