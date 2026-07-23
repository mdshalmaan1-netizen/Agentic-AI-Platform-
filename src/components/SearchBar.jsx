import { HiOutlineMagnifyingGlass, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2'

export default function SearchBar({ placeholder = 'Search...', value, onChange, onFilterClick }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field pl-10 bg-white"
        />
      </div>
      {onFilterClick && (
        <button onClick={onFilterClick} className="btn-secondary flex items-center gap-2 shrink-0">
          <HiOutlineAdjustmentsHorizontal /> Filters
        </button>
      )}
    </div>
  )
}
