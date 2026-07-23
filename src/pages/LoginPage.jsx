import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlinePhone } from 'react-icons/hi2'
import Logo from '../components/Logo'
import { useAppContext } from '../context/AppContext'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ emailOrPhone: '', password: '', remember: false })
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  const { login, loginWithGoogle, loading } = useAppContext()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      const res = await login(form.emailOrPhone || 'user@gmail.com', form.password || 'password123')
      if (res.success) {
        navigate('/dashboard')
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check your credentials.')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setErrorMsg('Google sign in failed.')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink">Welcome Back 👋</h1>
          <p className="text-sm text-ink-muted mt-1">Sign in with Gmail, Phone Number, or Email</p>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn-secondary w-full flex items-center justify-center gap-2 mt-6 py-2.5 hover:bg-cream-dark transition-colors"
          >
            <FcGoogle className="text-xl" /> Sign in with Gmail (Google)
          </button>

          <div className="flex items-center gap-3 my-6">
            <span className="h-px bg-border flex-1" />
            <span className="text-xs text-ink-muted">or login with Email / Mobile Number</span>
            <span className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink flex items-center gap-1">
                <HiOutlinePhone className="text-forest-600" /> Email Address or Mobile Number
              </label>
              <input
                type="text"
                name="emailOrPhone"
                required
                value={form.emailOrPhone}
                onChange={handleChange}
                placeholder="you@gmail.com or +91 98765 43210"
                className="input-field mt-1.5"
              />
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
                  placeholder="Enter your password"
                  className="input-field mt-1.5 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-ink-muted"
                >
                  {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-light">
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="rounded border-border" />
                Remember me
              </label>
              <Link to="#" className="text-forest-600 font-medium hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-forest-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
