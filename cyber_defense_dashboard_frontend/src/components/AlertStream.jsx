import React, { useMemo, useState } from 'react'
import { useDashboardStore } from '../store/useDashboardStore.js'
import dayjs from 'dayjs'
import clsx from 'clsx'

const severityStyles = {
  critical: 'badge-danger',
  high: 'badge-warning',
  medium: 'badge-success',
  low: 'badge-success',
}

export default function AlertStream() {
  const alerts = useDashboardStore((s) => s.alerts)
  const acknowledgeAlert = useDashboardStore((s) => s.acknowledgeAlert)
  const muteAlert = useDashboardStore((s) => s.muteAlert)
  const clearAlert = useDashboardStore((s) => s.clearAlert)
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState('all')

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const matchesQ =
        !query ||
        a.message.toLowerCase().includes(query.toLowerCase()) ||
        a.source.toLowerCase().includes(query.toLowerCase())
      const matchesS = severity === 'all' ? true : a.severity === severity
      return matchesQ && matchesS
    })
  }, [alerts, query, severity])

  return (
    <section aria-labelledby="alerts-title" className="card">
      <div className="card-header">
        <h2 id="alerts-title" className="card-title">
          Real-time Alerts
        </h2>
        <div className="flex items-center gap-2">
          <div className="input-icon">
            <span className="icon">🔎</span>
            <input
              aria-label="Search alerts"
              className="input h-9 w-48"
              placeholder="Search alerts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter severity"
            className="input h-9 w-40"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <ul role="list" className="max-h-96 space-y-2 overflow-auto" aria-live="polite">
        {filtered.length === 0 && (
          <li className="text-sm text-gray-500 dark:text-gray-400">No alerts</li>
        )}
        {filtered.map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-gray-200/70 bg-white/60 p-3 shadow-sm transition hover:shadow-md dark:border-gray-800/70 dark:bg-gray-900/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={clsx('badge', severityStyles[a.severity])}>
                  {a.severity.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {dayjs(a.timestamp).format('HH:mm:ss')}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">• {a.source}</span>
              </div>
              <div className="flex items-center gap-2">
                {!a.acknowledged && (
                  <button
                    className="btn-success h-8 px-2 text-xs"
                    onClick={() => acknowledgeAlert(a.id)}
                  >
                    Acknowledge
                  </button>
                )}
                {!a.muted && (
                  <button
                    className="btn-warning h-8 px-2 text-xs"
                    onClick={() => muteAlert(a.id)}
                  >
                    Mute
                  </button>
                )}
                <button className="btn-danger h-8 px-2 text-xs" onClick={() => clearAlert(a.id)}>
                  Clear
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{a.message}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
