import React from 'react'
import { useAppStore } from '../store/useAppStore'

function Meter({ label, value, suffix = '%', color = 'primary' }) {
  const colorMap = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  }
  const barColor = colorMap[color] || colorMap.primary
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-medium">{value}{suffix}</span>
      </div>
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded">
        <div
          className={`h-2 rounded ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} usage`}
        />
      </div>
    </div>
  )
}

// PUBLIC_INTERFACE
export default function SystemHealth() {
  /** Shows simulated system metrics */
  const metrics = useAppStore((s) => s.metrics)
  const updatedAt = useAppStore((s) => s.metrics.updatedAt)
  const formatTime = useAppStore((s) => s.formatTime)

  const cpuColor = metrics.cpu > 80 ? 'danger' : metrics.cpu > 65 ? 'warning' : 'primary'
  const memColor = metrics.memory > 85 ? 'danger' : metrics.memory > 70 ? 'warning' : 'primary'
  const diskColor = metrics.disk > 85 ? 'danger' : metrics.disk > 70 ? 'warning' : 'primary'

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">System Health</h3>
        <span className="text-xs text-gray-500">Updated {formatTime(updatedAt)}</span>
      </div>
      <div className="card-content space-y-4">
        <Meter label="CPU" value={metrics.cpu} color={cpuColor} />
        <Meter label="Memory" value={metrics.memory} color={memColor} />
        <Meter label="Disk" value={metrics.disk} color={diskColor} />
        <div className="text-xs text-gray-600 dark:text-gray-300">
          Network throughput: <span className="font-semibold">{metrics.network} Mbps</span>
        </div>
      </div>
    </div>
  )
}
