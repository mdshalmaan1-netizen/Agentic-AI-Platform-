import { HiXMark } from 'react-icons/hi2'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-soft w-full max-w-md p-6 animate-[fadeIn_0.2s_ease]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-ink">{title}</h3>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">
            <HiXMark className="text-xl" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
