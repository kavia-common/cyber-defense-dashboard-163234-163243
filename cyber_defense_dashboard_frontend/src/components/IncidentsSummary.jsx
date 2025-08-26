import React, { useEffect } from 'react'
import { useDashboardStore } from '../store/useDashboardStore.js'
import dayjs from 'dayjs'

export default function IncidentsSummary() {
  const incidents = useDashboardStore((s) => s.incidents)
  const seedIncidents = useDashboardStore((s) => s.seedIncidents)

  useEffect(() => {
    seedIncidents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section aria-labelledby="incidents-title" className="card">
      <div className="card-header">
        <h2 id="incidents-title" className="card-title">
          Incidents Summary
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Top Incidents</h3>
          <table className="table" role="table" aria-label="Top incidents">
            <thead>
              <tr>
                <th scope="col">Incident</th>
                <th scope="col">Severity</th>
                <th scope="col">Count</th>
                <th scope="col">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {incidents.top.map((i) => (
                <tr key={i.id}>
                  <td className="font-medium">{i.title}</td>
                  <td>
                    <span className="badge badge-warning">{i.severity}</span>
                  </td>
                  <td>{i.count}</td>
                  <td>
                    {dayjs(i.lastSeen).fromNow?.() || dayjs(i.lastSeen).format('YYYY-MM-DD HH:mm')}
                  </td>
                </tr>
              ))}
              {incidents.top.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No incidents to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Trending Attacks</h3>
          <ul className="space-y-2" role="list" aria-label="Trending attacks">
            {incidents.trending.map((t) => {
              const up = parseFloat(t.delta) >= 0
              return (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60"
                >
                  <span className="font-medium">{t.name}</span>
                  <span
                    className={`text-sm ${up ? 'text-green-600' : 'text-red-600'}`}
                    aria-label={`${t.delta}% change`}
                  >
                    {up ? '▲' : '▼'} {t.delta}%
                  </span>
                </li>
              )
            })}
            {incidents.trending.length === 0 && (
              <li className="text-sm text-gray-500 dark:text-gray-400">No trending data</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
