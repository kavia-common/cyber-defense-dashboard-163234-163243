import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200 bg-white/70 py-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300">
      <div className="mx-auto flex max-w-7xl justify-between px-4 sm:px-6 lg:px-8">
        <p>&copy; {year} Cyber Defense Dashboard</p>
        <p>Foundational demo - simulated data</p>
      </div>
    </footer>
  )
}
