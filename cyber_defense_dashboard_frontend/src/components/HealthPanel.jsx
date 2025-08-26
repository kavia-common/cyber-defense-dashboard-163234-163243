import React, { useEffect } from 'react'
import { useDashboardStore } from '../store/useDashboardStore.js'

export default function HealthPanel() {
  const health = useDashboardStore((s) => s.health)
  const updateHealth = useDashboardStore((s) => s.updateHealth)

  useEffect(() => {
    const id = setInterval(() => {
      // Simulate random fluctuations
      updateHealth({
        cpu: Math.min(100, Math.max(0, Math.round(health.cpu + (Math.random() * 10 - 5)))),
        memory: Math.min(100, Math.max(0, Math.round(health.memory + (Math.random() * 6 - 3)))),
        disk: Math.min(100, Math.max(0, Math.round(health.disk + (Math.random() * 8 - 4)))),
        endpointsOnline: Math.max(
          0,
          Math.min(health.endpointsTotal, health.endpointsOnline + (Math.random() > 0.5 ? 1 : -1))
        ),
      })
    }, 4000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section aria-labelledby="health-title" className="card">
      <div className="card-header">
        <h2 id="health-title" className="card-title">
          System Health
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Updated {new Date(health.lastUpdated).toLocaleTimeString()}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="CPU Usage" value={health.cpu} unit="%" />
        <Metric label="Memory Usage" value={health.memory} unit="%" />
        <Metric label="Disk Usage" value={health.disk} unit="%" />
        <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700/50">
          <div className="text-sm text-gray-600 dark:text-gray-300">Endpoints</div>
          <div className="mt-1 text-2xl font-semibold">
            {health.endpointsOnline} / {health.endpointsTotal}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {Math.round((health.endpointsOnline / health.endpointsTotal) * 100)}% online
          </div>
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value, unit }) {
  const color =
    value >= 85 ? 'text-red-600' : value >= 70 ? 'text-yellow-600' : 'text-green-600'
  return (
    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700/50">
      <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${color}`}>
        {value}
        {unit}
      </div>
      <div className="mt-2 h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-2 rounded ${color.replace('text-', 'bg-')}`}
          style={{ width: `${value}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  )
}
