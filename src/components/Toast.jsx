import { HiCheckCircle, HiXCircle, HiXMark } from 'react-icons/hi2'

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null
  const isSuccess = type === 'success'
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-border shadow-soft rounded-xl px-4 py-3 min-w-[280px] animate-[fadeIn_0.2s_ease]">
      {isSuccess ? (
        <HiCheckCircle className="text-forest-600 text-xl shrink-0" />
      ) : (
        <HiXCircle className="text-red-500 text-xl shrink-0" />
      )}
      <p className="text-sm text-ink flex-1">{message}</p>
      <button onClick={onClose} className="text-ink-muted hover:text-ink">
        <HiXMark />
      </button>
    </div>
  )
}
