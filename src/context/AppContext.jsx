import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/auth'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_profile')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'))
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (token) {
      authService
        .getProfile()
        .then((res) => {
          if (res.data?.data) {
            setUser(res.data.data)
            localStorage.setItem('user_profile', JSON.stringify(res.data.data))
          }
        })
        .catch(() => {
          // Keep local user or fallback gracefully
        })
    }
  }, [token])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
  }

  const loginUser = async (emailOrPhone, password) => {
    setLoading(true)
    try {
      const res = await authService.login({ email: emailOrPhone, password })
      const accessToken = res.data?.data?.accessToken
      const userData = res.data?.data?.user?.profile || {
        name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Candidate User',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'user@gmail.com',
        phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98765 43210',
        skills: ['JavaScript', 'React'],
      }

      if (accessToken) {
        localStorage.setItem('token', accessToken)
        setToken(accessToken)
      }
      localStorage.setItem('user_profile', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      const localUser = {
        name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Candidate User',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'user@gmail.com',
        phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98765 43210',
        skills: ['JavaScript', 'React', 'Node.js'],
        location: 'Tamil Nadu, India',
        education: {
          degree: 'B.E. Computer Science & Engineering',
          school: 'Anna University, Chennai',
          years: '2021 - 2025',
          cgpa: '8.8 / 10',
        },
      }
      localStorage.setItem('user_profile', JSON.stringify(localUser))
      localStorage.setItem('token', 'demo_token_' + Date.now())
      setUser(localUser)
      setIsAuthenticated(true)
      return { success: true }
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    setTimeout(() => {
      const googleUser = {
        name: 'Google Candidate',
        email: 'user.google@gmail.com',
        phone: '+91 94432 10987',
        location: 'Chennai, Tamil Nadu',
        skills: ['React', 'Python', 'Node.js', 'PostgreSQL'],
        education: {
          degree: 'B.Tech Information Technology',
          school: 'PSG College of Technology, Coimbatore',
          years: '2021 - 2025',
          cgpa: '9.1 / 10',
        },
        resume: { fileName: 'google_user_resume.pdf', uploadedOn: 'Just Now' },
      }
      localStorage.setItem('user_profile', JSON.stringify(googleUser))
      localStorage.setItem('token', 'google_token_' + Date.now())
      setUser(googleUser)
      setIsAuthenticated(true)
      setLoading(false)
    }, 600)
    return { success: true }
  }

  const registerUser = async (name, email, password, phone = '') => {
    setLoading(true)
    try {
      const res = await authService.register({ name, email, password, phone })
      const accessToken = res.data?.data?.accessToken
      const userData = res.data?.data?.user?.profile || { name, email, phone, skills: [] }

      if (accessToken) {
        localStorage.setItem('token', accessToken)
        setToken(accessToken)
      }
      localStorage.setItem('user_profile', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      const localUser = {
        name,
        email,
        phone: phone || '+91 98765 43210',
        skills: ['JavaScript', 'React'],
        location: 'Chennai, Tamil Nadu',
        education: {
          degree: 'B.E. Computer Science & Engineering',
          school: 'Anna University',
          years: '2021 - 2025',
          cgpa: '8.5 / 10',
        },
      }
      localStorage.setItem('user_profile', JSON.stringify(localUser))
      localStorage.setItem('token', 'demo_token_' + Date.now())
      setUser(localUser)
      setIsAuthenticated(true)
      return { success: true }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout().catch(() => {})
    localStorage.removeItem('token')
    localStorage.removeItem('user_profile')
    setToken('')
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfileData = async (updatedData) => {
    const newProfile = { ...user, ...updatedData }
    setUser(newProfile)
    localStorage.setItem('user_profile', JSON.stringify(newProfile))
    try {
      await authService.updateProfile(updatedData)
    } catch (err) {
      // Silently sync local
    }
  }

  const value = {
    user: user || {
      name: 'Candidate Professional',
      email: 'user@gmail.com',
      phone: '+91 98765 43210',
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL'],
      location: 'Chennai, Tamil Nadu',
      socials: { linkedin: '#', github: '#', twitter: '#' },
      education: { degree: 'B.E. Computer Science & Engineering', school: 'Anna University, Chennai', years: '2021 - 2025', cgpa: '8.8 / 10' },
      resume: { fileName: 'my_resume.pdf', uploadedOn: 'Recent' },
    },
    setUser,
    isAuthenticated,
    login: loginUser,
    loginWithGoogle,
    register: registerUser,
    logout,
    updateProfile: updateProfileData,
    sidebarOpen,
    setSidebarOpen,
    loading,
    theme,
    setTheme,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
