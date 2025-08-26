import React from 'react'
import { useDashboardStore } from '../store/useDashboardStore.js'
import dayjs from 'dayjs'

export default function ActivityLog() {
  const activity = useDashboardStore((s) => s.activity)

  const exportCSV = () => {
    const header = ['timestamp', 'type', 'detail']
    const rows = activity.map((a) => [
      dayjs(a.timestamp).toISOString(),
      a.type,
      a.detail.replaceAll(',', ';'),
    ])
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section aria-labelledby="activity-title" className="card">
      <div className="card-header">
        <h2 id="activity-title" className="card-title">
          Activity Log
        </h2>
        <button className="btn h-9" onClick={exportCSV} aria-label="Export activity as CSV">
          Export CSV
        </button>
      </div>
      <div className="max-h-96 overflow-auto">
        <table className="table" role="table" aria-label="Activity log">
          <thead>
            <tr>
              <th scope="col">Timestamp</th>
              <th scope="col">Type</th>
              <th scope="col">Detail</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((a) => (
              <tr key={a.id}>
                <td className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                  {dayjs(a.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                </td>
                <td className="font-medium">{a.type}</td>
                <td>{a.detail}</td>
              </tr>
            ))}
            {activity.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-sm text-gray-500">
                  No activity yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
