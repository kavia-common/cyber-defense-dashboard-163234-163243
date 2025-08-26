import React from 'react'
import IncidentsSummary from '../components/IncidentsSummary.jsx'

export default function Incidents() {
  return (
    <div className="section">
      <IncidentsSummary />
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Drill-down</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Placeholder for incident drill-down and historical trends. Future versions will link to
          details from summaries and support filtering, timelines, and MITRE mappings.
        </p>
      </div>
    </div>
  )
}
