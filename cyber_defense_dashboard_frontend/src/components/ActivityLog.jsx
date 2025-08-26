import React from 'react'
import { useAppStore } from '../store/useAppStore'

// PUBLIC_INTERFACE
export default function ActivityLog() {
  /** Tabular activity feed for user/system actions */
  const activity = useAppStore((s) => s.activity)
  const formatTime = useAppStore((s) => s.formatTime)

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Activity Log</h3>
        <span className="text-xs text-gray-500">{activity.length} events</span>
      </div>
      <div className="card-content overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs text-gray-500 uppercase">
            <tr>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {activity.map((a) => (
              <tr key={a.id}>
                <td className="py-2 pr-4 whitespace-nowrap">{formatTime(a.time)}</td>
                <td className="py-2 pr-4">{a.user}</td>
                <td className="py-2 pr-4">{a.action}</td>
              </tr>
            ))}
            {activity.length === 0 && (
              <tr>
                <td className="py-4 text-gray-500" colSpan={3}>
                  No activity yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
