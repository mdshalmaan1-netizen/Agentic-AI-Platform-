export default function Loader({ size = 'md', full = false }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' }
  const spinner = (
    <div className={`${sizes[size]} rounded-full border-forest-200 border-t-forest-600 animate-spin`} />
  )
  if (full) {
    return <div className="flex items-center justify-center py-20">{spinner}</div>
  }
  return spinner
}
