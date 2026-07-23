import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlinePhone } from 'react-icons/hi2'
import Logo from '../components/Logo'
import { useAppContext } from '../context/AppContext'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', agree: false })
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  const { register, loading } = useAppContext()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (form.password !== form.confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    try {
      const res = await register(form.name, form.email, form.password, form.phone)
      if (res.success) {
        navigate('/dashboard')
      }
    } catch (err) {
      setErrorMsg('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink">Create Account 🚀</h1>
          <p className="text-sm text-ink-muted mt-1">Join Agentic AI Career Platform</p>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="text-sm font-medium text-ink">Full name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                className="input-field mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-ink">Email address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@gmail.com"
                  className="input-field mt-1.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink flex items-center gap-1">
                  <HiOutlinePhone className="text-forest-600" /> Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="input-field mt-1.5"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="input-field mt-1.5 pr-10"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-ink-muted">
                  {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="input-field mt-1.5"
              />
            </div>
            <label className="flex items-start gap-2 text-sm text-ink-light">
              <input type="checkbox" name="agree" required checked={form.agree} onChange={handleChange} className="mt-0.5 rounded border-border" />
              I agree to the <Link to="#" className="text-forest-600 hover:underline">Terms &amp; Conditions</Link>
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-forest-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
