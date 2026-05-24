import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
}

export function SearchBar({
  placeholder = 'Search products…',
  value,
  onChange,
  onSubmit,
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState('')
  const navigate = useNavigate()

  const isControlled = value !== undefined && onChange !== undefined
  const query = isControlled ? value : internalQuery

  function handleChange(v: string) {
    if (isControlled) {
      onChange!(v)
    } else {
      setInternalQuery(v)
    }
  }

  function handleSubmit() {
    const val = query.trim()
    if (onSubmit) {
      onSubmit(val)
    } else if (val) {
      navigate(`/products?search=${encodeURIComponent(val)}`)
    } else {
      navigate('/products')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" aria-label="Submit search" onClick={handleSubmit}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  )
}
