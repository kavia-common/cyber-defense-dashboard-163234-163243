import React from 'react'
import { useAppStore } from '../store/useAppStore'

export default function Settings() {
  const darkMode = useAppStore((s) => s.darkMode)
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode)
  const mutedLevels = useAppStore((s) => s.mutedLevels)
  const muteLevel = useAppStore((s) => s.muteLevel)
  const unmuteLevel = useAppStore((s) => s.unmuteLevel)
  const clearAlerts = useAppStore((s) => s.clearAlerts)
  const stopSimulations = useAppStore((s) => s.stopSimulations)
  const startSimulations = useAppStore((s) => s.startSimulations)

  const levels = ['info', 'warning', 'danger']

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Appearance</h3>
        </div>
        <div className="card-content">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} aria-label="Dark mode" />
            <span>Dark mode</span>
          </label>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Alert Preferences</h3>
        </div>
        <div className="card-content space-y-3">
          {levels.map((lvl) => {
            const muted = mutedLevels.includes(lvl)
            return (
              <label key={lvl} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={muted}
                  onChange={() => (muted ? unmuteLevel(lvl) : muteLevel(lvl))}
                  aria-label={`Mute ${lvl} alerts`} />
                <span className="capitalize">{lvl}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Simulation</h3>
        </div>
        <div className="card-content flex flex-wrap gap-2">
          <button onClick={startSimulations} className="btn-primary">Start</button>
          <button onClick={stopSimulations} className="btn-outline">Stop</button>
          <button onClick={clearAlerts} className="btn-ghost">Clear Alerts</button>
        </div>
      </div>
    </div>
  )
}
