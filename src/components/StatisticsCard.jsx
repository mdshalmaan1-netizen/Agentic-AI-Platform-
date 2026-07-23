export default function StatisticsCard({ label, value, icon: Icon, tint = 'forest' }) {
  const tints = {
    forest: 'bg-forest-50 text-forest-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-500',
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      {Icon && (
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tints[tint]}`}>
          <Icon className="text-xl" />
        </span>
      )}
      <div>
        <p className="text-2xl font-bold text-ink">{value}</p>
        <p className="text-xs text-ink-muted mt-0.5">{label}</p>
      </div>
    </div>
  )
}
