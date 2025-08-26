import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Settings() {
  const { isDark, toggle } = useTheme()
  const { user } = useAuth()
  return (
    <div className="section">
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Preferences</h2>
          <button className="btn h-9" onClick={toggle}>
            Switch to {isDark ? 'Light' : 'Dark'} Mode
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            Logged in as: <span className="font-medium">{user?.username}</span> (role:{' '}
            <span className="font-medium">{user?.role}</span>)
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Future settings: refresh rate, alert thresholds, saved filters, notifications, and layout
            presets.
          </p>
        </div>
      </section>
    </div>
  )
}
