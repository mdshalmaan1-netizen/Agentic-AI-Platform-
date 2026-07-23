import { NavLink, useNavigate } from 'react-router-dom'
import {
  HiOutlineSquares2X2,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineTrophy,
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineMicrophone,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2'
import Logo from './Logo'
import { useAppContext } from '../context/AppContext'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: HiOutlineSquares2X2 },
  { label: 'Jobs', to: '/jobs', icon: HiOutlineBriefcase },
  { label: 'Internships', to: '/internships', icon: HiOutlineAcademicCap },
  { label: 'Hackathons', to: '/hackathons', icon: HiOutlineTrophy },
  { label: 'Applications', to: '/applications', icon: HiOutlineClipboardDocumentList },
  { label: 'AI Assistant', to: '/assistant', icon: HiOutlineChatBubbleLeftRight },
  { label: 'Resume Analyzer', to: '/resume', icon: HiOutlineDocumentMagnifyingGlass },
  { label: 'Interview Prep', to: '/interview', icon: HiOutlineMicrophone },
  { label: 'Profile', to: '/profile', icon: HiOutlineUser },
  { label: 'Settings', to: '/settings', icon: HiOutlineCog6Tooth },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAppContext()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-border px-4 py-6">
      <div className="px-2 mb-8">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <item.icon className="text-lg shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={handleLogout} className="sidebar-link mt-2 text-red-500 hover:bg-red-50 hover:text-red-600">
        <HiOutlineArrowRightOnRectangle className="text-lg" />
        Logout
      </button>
    </aside>
  )
}
