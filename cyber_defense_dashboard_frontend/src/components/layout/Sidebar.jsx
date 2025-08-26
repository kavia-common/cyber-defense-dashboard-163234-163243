import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { useDashboardStore } from '../../store/useDashboardStore.js'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/incidents', label: 'Incidents' },
  { to: '/activity', label: 'Activity Log' },
  { to: '/settings', label: 'Settings' },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const streaming = useDashboardStore((s) => s.streaming)
  const startStreaming = useDashboardStore((s) => s.startStreaming)
  const stopStreaming = useDashboardStore((s) => s.stopStreaming)

  return (
    <aside
      className="sticky top-[4.25rem] hidden h-[calc(100vh-4.25rem)] w-64 shrink-0 md:block"
      aria-label="Sidebar"
    >
      <div className="card h-full">
        <div className="card-header">
          <h2 className="card-title">Navigation</h2>
        </div>
        <nav className="flex flex-col gap-1" aria-label="Section">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={clsx(
                'group relative rounded-md px-3 py-2 text-sm font-medium transition hover:bg-gray-50 dark:hover:bg-gray-800/60',
                pathname === l.to
                  ? 'bg-gray-100 text-gray-900 ring-1 ring-brand-500/20 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-700 dark:text-gray-200'
              )}
            >
              <span className="relative z-10">{l.label}</span>
              {pathname === l.to && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 rounded-l-md bg-brand-600"
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Streaming</span>
            <span className="flex items-center gap-2">
              <span
                className={clsx(
                  'h-2 w-2 animate-pulse rounded-full',
                  streaming ? 'bg-green-500' : 'bg-gray-400'
                )}
                role="status"
                aria-label={streaming ? 'Streaming active' : 'Streaming stopped'}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {streaming ? 'Live' : 'Paused'}
              </span>
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button className="btn-success" onClick={startStreaming} disabled={streaming}>
              Start
            </button>
            <button className="btn-secondary" onClick={stopStreaming} disabled={!streaming}>
              Stop
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
