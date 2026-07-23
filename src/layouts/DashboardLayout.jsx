import Sidebar from '../components/Sidebar'
import TopNavbar from '../components/TopNavbar'
import FloatingAIAssistant from '../components/FloatingAIAssistant'

export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-cream relative">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopNavbar title={title} />
        <main className="p-6 max-w-7xl mx-auto pb-24">{children}</main>
      </div>

      {/* Omnipresent Floating Agentic AI Assistant Hub */}
      <FloatingAIAssistant />
    </div>
  )
}
