import React from 'react'
import { useAppStore } from '../store/useAppStore'
import { LevelDot } from './icons'

// PUBLIC_INTERFACE
export default function AlertList() {
  /** Displays real-time alerts with actions */
  const alerts = useAppStore((s) => s.getVisibleAlerts())
  const ackAlert = useAppStore((s) => s.ackAlert)
  const clearAlerts = useAppStore((s) => s.clearAlerts)
  const formatTime = useAppStore((s) => s.formatTime)

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">Threat Alerts</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{alerts.length} items</span>
          <button onClick={clearAlerts} className="btn-ghost">Clear</button>
        </div>
      </div>
      <div className="card-content">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[360px] overflow-auto">
          {alerts.length === 0 && (
            <li className="py-8 text-center text-sm text-gray-500">No alerts</li>
          )}
          {alerts.map((a) => (
            <li key={a.id} className="py-3 flex items-start gap-3">
              <LevelDot level={a.level} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{a.title}</p>
                <p className="text-xs text-gray-500">Source: {a.source} • {formatTime(a.time)}</p>
              </div>
              <div>
                {a.acknowledged ? (
                  <span className="badge-success">Ack</span>
                ) : (
                  <button onClick={() => ackAlert(a.id)} className="btn-outline">Acknowledge</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
