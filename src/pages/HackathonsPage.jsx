import { useState, useMemo } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import HackathonCard from '../components/HackathonCard'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import { realHackathons } from '../utils/dummyData'

const tabs = ['All', 'Ongoing', 'Upcoming']

export default function HackathonsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return realHackathons.filter((h) => {
      const matchesTab = activeTab === 'All' || h.status.toLowerCase() === activeTab.toLowerCase()
      const matchesSearch =
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.organizer.toLowerCase().includes(search.toLowerCase()) ||
        h.platform.toLowerCase().includes(search.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [activeTab, search])

  return (
    <DashboardLayout title="Hackathons">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Explore Active Real-World Hackathons</h1>
          <p className="text-ink-muted mt-1">Discover live challenges from Devpost, Unstop, Devfolio, SIH &amp; MLH</p>
        </div>
        <div className="relative w-full sm:w-80">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Devpost, Unstop, SIH, MLH..."
            className="input-field pl-10 bg-white"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-forest-600 text-white' : 'bg-white border border-border text-ink-light hover:bg-cream-dark'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((h) => (
          <HackathonCard key={h.id} hackathon={h} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 card p-10 text-center text-ink-muted">
            <p className="text-base font-semibold text-ink">No matching hackathons found.</p>
            <p className="text-sm mt-1">Try resetting your search query or switching tabs.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
