import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200/70 bg-white/70 py-4 text-sm text-gray-600 backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/60 dark:text-gray-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <p>&copy; {year} Cyber Defense Dashboard</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Foundational demo - simulated data</p>
      </div>
    </footer>
  )
}
