import React from 'react'
import { useAppStore } from '../store/useAppStore'

function Pill({ text, severity }) {
  const map = {
    info: 'badge-info',
    warning: 'badge-warning',
    danger: 'badge-danger',
  }
  return <span className={`${map[severity] || 'badge-info'}`}>{text}</span>
}

// PUBLIC_INTERFACE
export default function IncidentsSummary() {
  /** Lists latest incidents aggregated from alerts */
  const incidents = useAppStore((s) => s.incidents)
  const formatTime = useAppStore((s) => s.formatTime)

  const top = React.useMemo(() => incidents.slice(0, 5), [incidents])

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">Top Incidents</h3>
        <span className="text-xs text-gray-500">{incidents.length} total</span>
      </div>
      <div className="card-content">
        <ul role="list" className="space-y-3">
          {top.length === 0 && <li className="text-sm text-gray-500">No incidents</li>}
          {top.map((i) => (
            <li key={i.id} className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{i.title}</p>
                <p className="text-xs text-gray-500">Last seen: {formatTime(i.lastSeen)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Pill text={`x${i.count}`} severity={i.severity} />
                <Pill text={i.severity} severity={i.severity} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
