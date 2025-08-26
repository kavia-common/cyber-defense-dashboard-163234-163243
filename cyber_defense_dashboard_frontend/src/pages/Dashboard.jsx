import React, { useEffect } from 'react'
import HealthPanel from '../components/HealthPanel.jsx'
import AlertStream from '../components/AlertStream.jsx'
import IncidentsSummary from '../components/IncidentsSummary.jsx'
import ActivityLog from '../components/ActivityLog.jsx'
import { useDashboardStore } from '../store/useDashboardStore.js'

export default function Dashboard() {
  const startStreaming = useDashboardStore((s) => s.startStreaming)

  useEffect(() => {
    startStreaming()
    // let it run; cleanup handled in store stopStreaming when sidebar control used
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="section">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertStream />
        </div>
        <HealthPanel />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncidentsSummary />
        </div>
        <ActivityLog />
      </div>
    </div>
  )
}
