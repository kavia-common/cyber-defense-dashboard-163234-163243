import React from 'react'
import AlertList from '../components/AlertList'
import SystemHealth from '../components/SystemHealth'
import IncidentsSummary from '../components/IncidentsSummary'

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AlertList />
        </div>
        <div className="lg:col-span-1">
          <SystemHealth />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1">
          <IncidentsSummary />
        </div>
        <div className="xl:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Trending Attacks (Simulated)</h3>
              <span className="text-xs text-gray-500">Realtime</span>
            </div>
            <div className="card-content">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Placeholder area for charts (e.g., line/area chart). Integrate charting library in future iteration.
              </p>
              <ul className="mt-3 text-sm list-disc list-inside text-gray-500">
                <li>SSH brute-force attempts rising</li>
                <li>Malware IOC matches steady</li>
                <li>DDoS signatures fluctuating</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
