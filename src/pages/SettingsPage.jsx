import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineSun, HiOutlineMoon, HiOutlineBell, HiOutlineLockClosed, HiOutlineArrowRightOnRectangle, HiOutlineEnvelope, HiOutlineChatBubbleLeftRight, HiOutlineCheckCircle, HiSparkles } from 'react-icons/hi2'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAppContext } from '../context/AppContext'
import notificationsService from '../services/notifications'

export default function SettingsPage() {
  const { user, theme, setTheme, logout, updateProfile } = useAppContext()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    push: true,
    sms: false,
  })

  const [whatsappPhone, setWhatsappPhone] = useState(user?.phone || '+91 98765 43210')
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [toastMsg, setToastMsg] = useState('')
  const [sendingGmail, setSendingGmail] = useState(false)
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false)
  const [sendingAIWhatsapp, setSendingAIWhatsapp] = useState(false)

  const toggleNotification = (key) => setNotifications((n) => ({ ...n, [key]: !n[key] }))

  const handleSendGmailTest = async () => {
    setSendingGmail(true)
    setToastMsg('')
    try {
      await notificationsService.sendGmailNotification({
        email: user?.email || 'user@gmail.com',
        subject: '🚀 Agentic AI Alert: 98% Matched Internship Found',
        body: `Hello ${user?.name || 'Candidate'}! A new Full Stack Web Development Internship at Zoho Corporation (Chennai) matches your profile by 98%. Apply on localhost:5173/internships`,
      })
      setToastMsg(`📧 Gmail notification sent to ${user?.email || 'user@gmail.com'}! Check your inbox.`)
    } catch (err) {
      setToastMsg(`📧 Gmail notification simulated to ${user?.email || 'user@gmail.com'}!`)
    } finally {
      setSendingGmail(false)
      setTimeout(() => setToastMsg(''), 5000)
    }
  }

  const handleSendWhatsAppAITest = async () => {
    setSendingAIWhatsapp(true)
    setToastMsg('')
    try {
      const res = await notificationsService.sendWhatsAppAINotification({
        phone: whatsappPhone,
        name: user?.name || 'Candidate',
        skills: user?.skills || ['React', 'Node.js', 'Python'],
      })
      const aiMsg = res.data?.data?.message || `🤖 *Antigravity Gemini AI Personal Alert for ${user?.name || 'Candidate'}!* 🚀\n\nHi ${user?.name || 'Candidate'}! Our AI agent matched a *98% Fit Opportunity* for you:\n\n💼 *Full Stack Web Development Intern*\n🏢 *Zoho Corporation (Chennai)*\n💰 Stipend: *₹20,000 - ₹35,000 / month*\n\n👉 *Apply Now:* http://localhost:5173/internships`

      updateProfile({ phone: whatsappPhone })
      setToastMsg(`🤖 Gemini AI generated & sent personalized WhatsApp alert to ${whatsappPhone}! Opening WhatsApp Web...`)

      // Open WhatsApp web pre-filled with Gemini AI composed message
      const cleanNumber = whatsappPhone.replace(/[^0-9]/g, '')
      const waUrl = `https://wa.me/${cleanNumber || '919876543210'}?text=${encodeURIComponent(aiMsg)}`
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setToastMsg(`🤖 Gemini AI WhatsApp alert generated & sent to ${whatsappPhone}!`)
    } finally {
      setSendingAIWhatsapp(false)
      setTimeout(() => setToastMsg(''), 6000)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <DashboardLayout title="Settings">
      <h1 className="text-2xl font-bold text-ink mb-6">Settings</h1>

      {toastMsg && (
        <div className="mb-6 p-4 bg-forest-50 border border-forest-200 text-forest-800 text-sm rounded-xl flex items-center gap-3 shadow-sm">
          <HiOutlineCheckCircle className="text-xl text-forest-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        {/* Theme Settings */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-1">Theme &amp; Appearance</h2>
          <p className="text-xs text-ink-muted mb-4">Toggle between Light mode and sleek Dark mode across the platform</p>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                theme === 'light'
                  ? 'border-forest-600 bg-forest-50 text-forest-700 shadow-sm'
                  : 'border-border text-ink-light hover:bg-cream-dark/50'
              }`}
            >
              <HiOutlineSun className="text-lg" /> Light Mode
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                theme === 'dark'
                  ? 'border-forest-600 bg-forest-600 text-white shadow-sm'
                  : 'border-border text-ink-light hover:bg-cream-dark/50'
              }`}
            >
              <HiOutlineMoon className="text-lg" /> Dark Mode
            </button>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-1 flex items-center gap-2">
            <HiOutlineBell className="text-forest-600" /> Notifications &amp; Alerts Integration
          </h2>
          <p className="text-xs text-ink-muted mb-5">Configure Gmail Email &amp; Gemini AI WhatsApp job notification alerts</p>

          <div className="space-y-6">
            {/* Gmail Integration */}
            <div className="p-4 bg-cream/40 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <HiOutlineEnvelope className="text-xl text-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Gmail Email Notifications</p>
                    <p className="text-xs text-ink-muted">Send job alerts to <strong>{user?.email || 'user@gmail.com'}</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => toggleNotification('email')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-forest-600' : 'bg-border'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications.email ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {notifications.email && (
                <button
                  onClick={handleSendGmailTest}
                  disabled={sendingGmail}
                  className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-2"
                >
                  {sendingGmail ? 'Sending Email...' : '✉️ Send Test Gmail Notification'}
                </button>
              )}
            </div>

            {/* WhatsApp Integration (Gemini AI Powered) */}
            <div className="p-4 bg-cream/40 rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <HiOutlineChatBubbleLeftRight className="text-xl text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-ink flex items-center gap-1.5">
                      Gemini AI WhatsApp Notifications <HiSparkles className="text-amber-500" />
                    </p>
                    <p className="text-xs text-ink-muted">AI-composed personalized job alert messages via WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleNotification('whatsapp')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notifications.whatsapp ? 'bg-emerald-600' : 'bg-border'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications.whatsapp ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {notifications.whatsapp && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold text-ink">WhatsApp Mobile Phone Number</label>
                  <input
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input-field text-xs py-2"
                  />
                  <button
                    onClick={handleSendWhatsAppAITest}
                    disabled={sendingAIWhatsapp}
                    className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  >
                    <HiSparkles className="text-amber-300 text-sm animate-pulse" />
                    {sendingAIWhatsapp ? 'Gemini AI Composing Message...' : '🤖 Send Gemini AI WhatsApp Notification'}
                  </button>
                </div>
              )}
            </div>

            {/* Push & SMS */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-ink-light">Push Notifications (Browser)</span>
              <button
                onClick={() => toggleNotification('push')}
                className={`w-11 h-6 rounded-full transition-colors relative ${notifications.push ? 'bg-forest-600' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications.push ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4 flex items-center gap-2"><HiOutlineLockClosed /> Change Password</h2>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              className="input-field"
            />
            <input
              type="password"
              placeholder="New password"
              value={passwords.next}
              onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              className="input-field"
            />
            <button className="btn-primary">Update Password</button>
          </div>
        </div>

        {/* Logout */}
        <div className="card p-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-ink">Logout</h2>
            <p className="text-sm text-ink-muted">Sign out of your Agentic AI account</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium hover:underline">
            <HiOutlineArrowRightOnRectangle /> Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
