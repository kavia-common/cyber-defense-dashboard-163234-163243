import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs text-gray-500">
      <p>Cyber Defense Dashboard • For demo purposes only • © {new Date().getFullYear()}</p>
    </footer>
  )
}
