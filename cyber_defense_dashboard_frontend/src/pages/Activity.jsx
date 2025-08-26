import React from 'react'
import ActivityLog from '../components/ActivityLog.jsx'
import { useDashboardStore } from '../store/useDashboardStore.js'

export default function Activity() {
  const clearAll = useDashboardStore((s) => s.clearAll)
  return (
    <div className="section">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Controls</h2>
          <button className="btn-danger h-9" onClick={clearAll}>
            Clear Alerts & Activity
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Manage the activity feed. Use Export CSV in the table header to download logs.
        </p>
      </div>
      <ActivityLog />
    </div>
  )
}
