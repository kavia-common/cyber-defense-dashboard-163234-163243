import React from 'react'

// PUBLIC_INTERFACE
export function MagnifyingGlassIcon(props) {
  /** Small magnifying glass icon */
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path stroke="currentColor" strokeWidth="2" d="m21 21-4.3-4.3M3 11a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z" />
    </svg>
  )
}

// PUBLIC_INTERFACE
export function LevelDot({ level = 'info' }) {
  /** Colored dot indicating alert severity */
  const map = {
    info: 'bg-primary-400',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  }
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${map[level] || map.info}`} aria-hidden="true" />
}
