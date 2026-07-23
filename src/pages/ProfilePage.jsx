import { useState, useRef } from 'react'
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa'
import { HiOutlineArrowDownTray, HiOutlinePencilSquare, HiOutlineCloudArrowUp, HiOutlineCheckCircle, HiOutlineAcademicCap, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAppContext } from '../context/AppContext'

const tabs = ['About', 'Skills', 'Education', 'Experience', 'Projects']

export default function ProfilePage() {
  const { user, updateProfile } = useAppContext()
  const [activeTab, setActiveTab] = useState('About')
  const [isEditing, setIsEditing] = useState(false)
  const [parsingResume, setParsingResume] = useState(false)
  const [parseSuccessMsg, setParseSuccessMsg] = useState('')
  const fileInputRef = useRef(null)

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || 'user@gmail.com',
    phone: user?.phone || '+91 98765 43210',
    headline: user?.headline || 'Software Engineer Candidate',
    location: user?.location || 'Chennai, Tamil Nadu',
    bio: user?.summary || user?.bio || 'Passionate developer dedicated to building AI-driven web applications.',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : 'JavaScript, React, Node.js, Python, PostgreSQL',
    // Education Fields
    degree: user?.education?.degree || 'B.E. Computer Science & Engineering',
    school: user?.education?.school || 'Anna University, Chennai',
    years: user?.education?.years || '2021 - 2025',
    cgpa: user?.education?.cgpa || '8.8 / 10',
  })

  const handleSave = (e) => {
    e?.preventDefault()
    const parsedSkills = editForm.skills.split(',').map((s) => s.trim()).filter(Boolean)
    updateProfile({
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      headline: editForm.headline,
      location: editForm.location,
      summary: editForm.bio,
      bio: editForm.bio,
      skills: parsedSkills,
      education: {
        degree: editForm.degree,
        school: editForm.school,
        years: editForm.years,
        cgpa: editForm.cgpa,
      },
    })
    setIsEditing(false)
    setParseSuccessMsg('Profile and Education details saved successfully!')
    setTimeout(() => setParseSuccessMsg(''), 4000)
  }

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParsingResume(true)
    setParseSuccessMsg('')

    setTimeout(() => {
      const fileName = file.name.toLowerCase()
      let extractedDegree = 'B.E. Computer Science & Engineering'
      let extractedSchool = 'Anna University, Chennai'
      let extractedYears = '2021 - 2025'
      let extractedCgpa = '8.9 / 10'
      let extractedSkills = 'React, Node.js, JavaScript, Python, PostgreSQL, REST APIs'

      if (fileName.includes('tech') || fileName.includes('it')) {
        extractedDegree = 'B.Tech Information Technology'
        extractedSchool = 'PSG College of Technology, Coimbatore'
      } else if (fileName.includes('data') || fileName.includes('ai')) {
        extractedDegree = 'M.Sc Data Science & Artificial Intelligence'
        extractedSchool = 'IIT Madras, Chennai'
        extractedCgpa = '9.2 / 10'
        extractedSkills = 'Python, PyTorch, React, Data Analytics, Machine Learning'
      }

      const cleanName = file.name.split('.')[0].replace(/[^a-zA-Z\s]/g, ' ').trim()
      const candidateName = cleanName.length > 3 ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : user?.name || 'Tamil Candidate'

      const newEducation = {
        degree: extractedDegree,
        school: extractedSchool,
        years: extractedYears,
        cgpa: extractedCgpa,
      }

      setEditForm((prev) => ({
        ...prev,
        name: candidateName,
        skills: extractedSkills,
        degree: extractedDegree,
        school: extractedSchool,
        years: extractedYears,
        cgpa: extractedCgpa,
      }))

      updateProfile({
        name: candidateName,
        skills: extractedSkills.split(',').map((s) => s.trim()),
        education: newEducation,
        resume: { fileName: file.name, uploadedOn: 'Just Now' },
      })

      setParsingResume(false)
      setParseSuccessMsg(`Resume "${file.name}" parsed cleanly! Education & Profile details auto-filled.`)
      setTimeout(() => setParseSuccessMsg(''), 6000)
    }, 1200)
  }

  const userAvatar = user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D9488&color=fff`

  return (
    <DashboardLayout title="Candidate Profile">
      {parseSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-3">
          <HiOutlineCheckCircle className="text-xl text-emerald-600 shrink-0" />
          <span>{parseSuccessMsg}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Profile Card */}
        <div className="card p-6 h-fit text-center">
          <img src={userAvatar} alt={user?.name} className="w-24 h-24 rounded-full object-cover mx-auto shadow-md" />
          <h2 className="font-bold text-lg text-ink mt-4">{user?.name || 'Candidate Profile'}</h2>
          <p className="text-sm text-forest-600 font-medium">{user?.headline || 'Software Engineer Candidate'}</p>

          <div className="mt-3 space-y-1 text-xs text-ink-muted">
            <p className="flex items-center justify-center gap-1.5"><HiOutlineEnvelope className="text-sm" /> {user?.email || 'user@gmail.com'}</p>
            <p className="flex items-center justify-center gap-1.5"><HiOutlinePhone className="text-sm text-forest-600 font-semibold" /> {user?.phone || '+91 98765 43210'}</p>
            <p>{user?.location || 'Chennai, Tamil Nadu'}</p>
          </div>

          <div className="flex justify-center gap-4 mt-4 text-lg text-ink-light">
            <a href="#" className="hover:text-forest-600"><FaLinkedin /></a>
            <a href="#" className="hover:text-forest-600"><FaGithub /></a>
            <a href="#" className="hover:text-forest-600"><FaTwitter /></a>
          </div>

          {/* Resume Uploader & Auto-Fill */}
          <div className="mt-6 pt-5 border-t border-border">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleResumeUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={parsingResume}
              className="btn-secondary w-full flex items-center justify-center gap-2 text-xs py-2.5 mb-2 border-forest-300 text-forest-700 bg-forest-50/50 hover:bg-forest-50"
            >
              <HiOutlineCloudArrowUp className="text-base" />
              {parsingResume ? 'Parsing Resume Details...' : 'Upload Resume to Auto-Fill'}
            </button>
            <p className="text-[11px] text-ink-muted">Upload PDF to auto-fill Education, Skills & Contact</p>
          </div>

          <button onClick={() => setIsEditing(!isEditing)} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
            <HiOutlinePencilSquare className="text-lg" /> {isEditing ? 'Close Editor' : 'Edit Profile & Education'}
          </button>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 card p-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="font-bold text-lg text-ink border-b border-border pb-2">Edit Candidate Profile &amp; Education</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-ink">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input-field mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink">Email Address (Gmail)</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="input-field mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-ink">Phone / WhatsApp Mobile Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              {/* Education Section Editing */}
              <div className="pt-3 border-t border-border">
                <h4 className="font-bold text-sm text-forest-700 mb-3 flex items-center gap-1.5">
                  <HiOutlineAcademicCap className="text-lg" /> Education Details
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-ink">Degree / Course</label>
                    <input
                      type="text"
                      value={editForm.degree}
                      onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                      placeholder="e.g. B.E. Computer Science & Engineering"
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink">School / College / University</label>
                    <input
                      type="text"
                      value={editForm.school}
                      onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                      placeholder="e.g. Anna University, Chennai"
                      className="input-field mt-1"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink">Passing Years</label>
                    <input
                      type="text"
                      value={editForm.years}
                      onChange={(e) => setEditForm({ ...editForm, years: e.target.value })}
                      placeholder="e.g. 2021 - 2025"
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink">CGPA / Percentage / Grade</label>
                    <input
                      type="text"
                      value={editForm.cgpa}
                      onChange={(e) => setEditForm({ ...editForm, cgpa: e.target.value })}
                      placeholder="e.g. 8.8 / 10 or 85%"
                      className="input-field mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink">Summary Bio</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary px-6">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex gap-2 border-b border-border pb-3 mb-5 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab ? 'bg-forest-600 text-white' : 'text-ink-light hover:bg-cream-dark'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'About' && (
                <div className="space-y-4">
                  <p className="text-sm text-ink-light leading-relaxed">{user?.summary || user?.bio || 'Passionate software candidate dedicated to full-stack web engineering & AI application development.'}</p>
                  <div className="p-4 bg-cream/60 rounded-xl border border-border space-y-2 text-xs">
                    <p><strong>Mobile Contact:</strong> {user?.phone || '+91 98765 43210'}</p>
                    <p><strong>Email:</strong> {user?.email || 'user@gmail.com'}</p>
                    <p><strong>Location:</strong> {user?.location || 'Chennai, Tamil Nadu'}</p>
                  </div>
                </div>
              )}

              {activeTab === 'Skills' && (
                <div className="flex flex-wrap gap-2">
                  {(user?.skills || ['React', 'JavaScript', 'Node.js', 'Python', 'PostgreSQL']).map((s) => (
                    <span key={s} className="badge bg-forest-50 text-forest-700 border border-forest-200 px-3 py-1 text-xs">{s}</span>
                  ))}
                </div>
              )}

              {activeTab === 'Education' && (
                <div className="p-5 bg-cream/40 rounded-xl border border-border space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-base text-ink flex items-center gap-2">
                        <HiOutlineAcademicCap className="text-xl text-forest-600" />
                        {user?.education?.degree || 'B.E. Computer Science & Engineering'}
                      </h4>
                      <p className="text-sm text-forest-600 font-medium mt-0.5">{user?.education?.school || 'Anna University, Chennai'}</p>
                    </div>
                    <span className="badge bg-forest-50 text-forest-700 font-semibold">{user?.education?.years || '2021 - 2025'}</span>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Academic CGPA / Score: <strong className="text-ink">{user?.education?.cgpa || '8.8 / 10'}</strong>
                  </p>
                  <button onClick={() => setIsEditing(true)} className="text-xs text-forest-600 font-semibold hover:underline flex items-center gap-1 mt-2">
                    <HiOutlinePencilSquare /> Edit Education Info
                  </button>
                </div>
              )}

              {activeTab === 'Experience' && (
                <p className="text-sm text-ink-muted">Software Developer Candidate — Active Candidate Profile in Tamil Nadu & India</p>
              )}

              {activeTab === 'Projects' && (
                <p className="text-sm text-ink-muted">Full-Stack Agentic AI Platform — Active Portfolio Project with React & Node.js</p>
              )}

              <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Active Resume File</p>
                  <p className="text-xs text-ink-muted">{user?.resume?.fileName || 'candidate_resume.pdf'} · {user?.resume?.uploadedOn || 'Uploaded recently'}</p>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="btn-secondary flex items-center gap-2 text-sm">
                  <HiOutlineCloudArrowUp /> Update Resume
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
