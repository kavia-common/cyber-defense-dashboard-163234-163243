import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import clsx from 'clsx'

export default function Header() {
  const { isDark, toggle } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="border-b border-gray-200 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-brand-600 font-bold text-white">
            CD
          </span>
          <span className="sr-only">Cyber Defense</span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Cyber Defense Dashboard
          </span>
        </Link>

        <nav aria-label="Global" className="hidden gap-6 md:flex">
          <NavItem to="/" label="Dashboard" />
          <NavItem to="/incidents" label="Incidents" />
          <NavItem to="/activity" label="Activity" />
          <NavItem to="/settings" label="Settings" />
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="btn-secondary h-9 px-2"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title="Toggle theme"
          >
            {isDark ? '🌙' : '☀️'}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-600 dark:text-gray-300 sm:inline">
                {user.username} ({user.role})
              </span>
              <button className="btn h-9" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn h-9">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
          isActive && 'text-gray-900 dark:text-white'
        )
      }
      aria-label={label}
    >
      {label}
    </NavLink>
  )
}
