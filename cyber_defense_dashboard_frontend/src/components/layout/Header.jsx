import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import clsx from 'clsx'

export default function Header() {
  const { isDark, toggle } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur-md dark:border-gray-800/70 dark:bg-gray-900/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 font-bold text-white ring-1 ring-brand-600/30 group-hover:bg-brand-800">
            CD
          </span>
          <span className="sr-only">Cyber Defense</span>
          <span className="text-sm font-semibold leading-none text-gray-800 dark:text-gray-100">
            Cyber Defense Dashboard
          </span>
        </Link>

        <nav aria-label="Global" className="hidden items-center gap-6 md:flex">
          <NavItem to="/" label="Dashboard" />
          <NavItem to="/incidents" label="Incidents" />
          <NavItem to="/activity" label="Activity" />
          <NavItem to="/settings" label="Settings" />
          <NavItem to="/log-analyzer" label="Log Analyzer" />
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="btn-ghost h-9 px-2"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span aria-hidden="true">{isDark ? '🌙' : '☀️'}</span>
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
          isActive && 'text-gray-900 dark:text-white underline decoration-brand-500/50 underline-offset-8'
        )
      }
      aria-label={label}
    >
      {label}
    </NavLink>
  )
}
