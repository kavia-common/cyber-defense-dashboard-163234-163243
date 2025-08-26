import React from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function Sidebar() {
  const mutedLevels = useAppStore((s) => s.mutedLevels)
  const muteLevel = useAppStore((s) => s.muteLevel)
  const unmuteLevel = useAppStore((s) => s.unmuteLevel)

  const levels = [
    { id: 'info', label: 'Info', color: 'badge-info' },
    { id: 'warning', label: 'Warning', color: 'badge-warning' },
    { id: 'danger', label: 'Critical', color: 'badge-danger' },
  ]

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Filters</h2>
      </div>
      <div className="card-content space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Mute alert levels</p>
          <div className="flex flex-wrap gap-2">
            {levels.map((lvl) => {
              const muted = mutedLevels.includes(lvl.id)
              return (
                <button
                  key={lvl.id}
                  onClick={() => (muted ? unmuteLevel(lvl.id) : muteLevel(lvl.id))}
                  className={`${lvl.color} ${muted ? 'opacity-50' : ''}`}
                  aria-pressed={muted}
                >
                  {lvl.label}
                </button>
              )
            })}
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm font-medium mb-2">Quick Links</p>
          <div className="flex flex-col gap-1">
            <Link className="text-sm text-primary-600 hover:underline" to="/">Overview</Link>
            <Link className="text-sm text-primary-600 hover:underline" to="/activity">Activity</Link>
            <Link className="text-sm text-primary-600 hover:underline" to="/settings">Settings</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
