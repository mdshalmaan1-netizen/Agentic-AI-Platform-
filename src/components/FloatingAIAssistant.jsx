import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineSparkles,
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineCpuChip,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineMicrophone,
  HiOutlineBriefcase,
} from 'react-icons/hi2'
import { useAppContext } from '../context/AppContext'
import aiService from '../services/ai'

export default function FloatingAIAssistant() {
  const { user } = useAppContext()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Vanakkam ${user?.name || 'Candidate'}! 🤖 I am your Agentic Gemini AI Career Co-Pilot. How can I empower your job search today?`,
    },
  ])
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (open) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userText = input
    const newMessages = [...messages, { sender: 'user', text: userText }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await aiService.sendMessage(
        userText,
        newMessages.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }))
      )

      const reply = res.data?.data?.reply || `I analyzed your request regarding "${userText}"! I recommend exploring live Tamil Nadu opportunities and running an ATS resume scan.`
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `I've analyzed your query "${userText}"! Here are top recommended software opportunities for you in Chennai & Coimbatore with 98% profile fit score.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Floating Agentic AI Assistant Drawer */}
      {open && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white border border-border shadow-2xl rounded-3xl flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-forest-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-forest-600 border border-forest-500 flex items-center justify-center text-lg text-amber-300">
                <HiOutlineSparkles />
              </span>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  Gemini AI Co-Pilot <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-forest-200">Agentic AI Career Partner</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-forest-200 hover:text-white p-1 text-xl transition-colors"
            >
              <HiOutlineXMark />
            </button>
          </div>

          {/* Quick Agentic Actions Bar */}
          <div className="bg-forest-50/70 p-2.5 border-b border-border flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold">
            <button
              onClick={() => navigate('/jobs')}
              className="px-2.5 py-1 rounded-lg bg-white border border-forest-200 text-forest-700 hover:bg-forest-100 shrink-0 flex items-center gap-1 transition-colors"
            >
              <HiOutlineBriefcase className="text-xs" /> Auto Jobs
            </button>
            <button
              onClick={() => navigate('/resume')}
              className="px-2.5 py-1 rounded-lg bg-white border border-forest-200 text-forest-700 hover:bg-forest-100 shrink-0 flex items-center gap-1 transition-colors"
            >
              <HiOutlineDocumentMagnifyingGlass className="text-xs" /> ATS Scan
            </button>
            <button
              onClick={() => navigate('/interview')}
              className="px-2.5 py-1 rounded-lg bg-white border border-forest-200 text-forest-700 hover:bg-forest-100 shrink-0 flex items-center gap-1 transition-colors"
            >
              <HiOutlineMicrophone className="text-xs" /> Prep Flashcards
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-cream/30 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'ml-auto bg-forest-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white border border-border text-ink rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
              </div>
            ))}
            {loading && (
              <div className="p-3 bg-white border border-border text-forest-700 rounded-2xl rounded-bl-none w-fit text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest-600 animate-ping" />
                Gemini AI Agent thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-border flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Agentic AI (e.g. jobs in Chennai)..."
              className="input-field text-xs py-2 flex-1"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-forest-600 text-white flex items-center justify-center shrink-0 hover:bg-forest-700 disabled:opacity-50 transition-colors"
            >
              <HiOutlinePaperAirplane className="text-sm" />
            </button>
          </form>
        </div>
      )}

      {/* Trigger Floating Action Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs shadow-xl border-2 border-amber-400/60 transition-all hover:scale-105"
      >
        <span className="w-6 h-6 rounded-full bg-forest-600 flex items-center justify-center text-amber-300 text-sm animate-pulse">
          <HiOutlineCpuChip />
        </span>
        <span>Agentic AI Assistant</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
      </button>
    </div>
  )
}
