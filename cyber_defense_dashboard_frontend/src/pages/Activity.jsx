import React from 'react'
import ActivityLog from '../components/ActivityLog.jsx'
import { useDashboardStore } from '../store/useDashboardStore.js'

export default function Activity() {
  const clearAll = useDashboardStore((s) => s.clearAll)
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Controls</h2>
          <button className="btn h-9" onClick={clearAll}>
            Clear Alerts & Activity
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Use controls to manage the activity feed. Export from the table header.
        </p>
      </div>
      <ActivityLog />
    </div>
  )
}
