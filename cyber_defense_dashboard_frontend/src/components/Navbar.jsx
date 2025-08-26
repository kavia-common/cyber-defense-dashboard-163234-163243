import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { MagnifyingGlassIcon } from './icons'

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-primary-100 text-primary-900 dark:bg-primary-900/40 dark:text-primary-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`
      }
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  const appName = typeof __APP_NAME__ === 'string' ? __APP_NAME__ : 'Cyber Defense Dashboard'
  const darkMode = useAppStore((s) => s.darkMode)
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode)
  const user = useAppStore((s) => s.user)
  const logout = useAppStore((s) => s.logout)

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label={appName} className="font-semibold text-primary-600">
              {appName}
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavItem to="/" label="Dashboard" />
              <NavItem to="/activity" label="Activity" />
              <NavItem to="/settings" label="Settings" />
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <label htmlFor="site-search" className="sr-only">Search</label>
              <input id="site-search" type="search" placeholder="Search…" className="w-44 md:w-64 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" aria-label="Search dashboard content" />
              <MagnifyingGlassIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            <button
              onClick={toggleDarkMode}
              className="btn-ghost"
              aria-pressed={darkMode}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300" aria-label={`Logged in as ${user.username}`}>{user.username}</span>
                <button onClick={logout} className="btn-outline">Logout</button>
              </div>
            ) : (
              <Link className="btn-primary" to="/login">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
