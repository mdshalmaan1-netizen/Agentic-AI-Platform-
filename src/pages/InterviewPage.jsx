import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import aiService from '../services/ai'

const roles = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'AI / ML Engineer', 'DevOps Specialist']
const difficulties = ['Beginner', 'Intermediate', 'Advanced']

export default function InterviewPage() {
  const [role, setRole] = useState(roles[0])
  const [company, setCompany] = useState('Google / Top Tech')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      q: 'Explain how React Reconciliation and the Diffing Algorithm optimize DOM updates.',
      a: 'React uses an O(n) heuristic diffing algorithm comparing component element types and keys to update only changed DOM nodes.',
    },
    {
      id: 'q2',
      q: 'How do you structure robust JWT authentication with refresh token rotation in Express.js?',
      a: 'Store short-lived access tokens in memory/state and long-lived refresh tokens in secure httpOnly cookies, rotating on refresh.',
    },
  ])
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await aiService.generateInterviewQuestions(role, company, difficulty)
      const fetched = res.data?.data?.questions || []
      if (fetched.length > 0) {
        setQuestions(
          fetched.map((q, idx) => ({
            id: q.id || `q_${idx}`,
            q: q.question || q.q,
            a: q.idealAnswer || q.a,
          }))
        )
        setActiveIndex(0)
        setShowAnswer(false)
        setAnswer('')
      }
    } catch (err) {
      console.warn('Interview question generation error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    setActiveIndex((i) => Math.min(i + 1, questions.length - 1))
    setShowAnswer(false)
    setAnswer('')
  }

  const current = questions[activeIndex] || questions[0]

  return (
    <DashboardLayout title="Interview Preparation">
      <h1 className="text-2xl font-bold text-ink mb-1">Interview Flashcards &amp; AI Rubrics</h1>
      <p className="text-ink-muted mb-6">Generate real Gemini AI questions tailored to your target company and role</p>

      <div className="card p-5 flex flex-col sm:flex-row gap-4 items-end mb-6">
        <div className="flex-1 w-full">
          <label className="text-sm font-medium text-ink">Target Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field mt-1.5">
            {roles.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="text-sm font-medium text-ink">Target Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Google, Microsoft, Amazon"
            className="input-field mt-1.5"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="text-sm font-medium text-ink">Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="input-field mt-1.5">
            {difficulties.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full sm:w-auto px-6 shrink-0">
          {loading ? 'AI Generating...' : 'Generate Questions'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-ink mb-4">Questions ({questions.length})</h2>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <button
                key={q.id || i}
                onClick={() => { setActiveIndex(i); setShowAnswer(false); setAnswer('') }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                  i === activeIndex ? 'bg-forest-50 text-forest-700 font-medium' : 'text-ink-light hover:bg-cream-dark'
                }`}
              >
                {i + 1}. {q.q}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5 flex flex-col">
          <p className="font-semibold text-ink mb-3">Q{activeIndex + 1}. {current.q}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your STAR format answer here to practice..."
            rows={6}
            className="input-field resize-none flex-1"
          />
          {showAnswer && (
            <div className="mt-4 p-4 bg-forest-50 border border-forest-200 rounded-lg text-sm text-ink-light">
              <p className="font-semibold text-forest-700 mb-1">Gemini AI Model Answer &amp; Key Rubrics:</p>
              <p className="leading-relaxed">{current.a}</p>
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowAnswer(true)} className="btn-secondary flex-1">Reveal AI Model Answer</button>
            <button onClick={handleNext} className="btn-primary flex-1" disabled={activeIndex === questions.length - 1}>
              Next Question
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
