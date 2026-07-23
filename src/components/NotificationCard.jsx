export default function NotificationCard({ notification }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${notification.unread ? 'bg-forest-50' : ''}`}>
      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notification.unread ? 'bg-forest-600' : 'bg-ink-muted'}`} />
      <div>
        <p className="text-sm text-ink">{notification.text}</p>
        <p className="text-xs text-ink-muted mt-0.5">{notification.time}</p>
      </div>
    </div>
  )
}
