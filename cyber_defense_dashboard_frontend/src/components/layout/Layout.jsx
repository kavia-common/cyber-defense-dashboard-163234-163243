import React from 'react'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import Footer from './Footer.jsx'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Sidebar />
        <main id="main" className="min-w-0 flex-1" aria-live="polite" aria-busy="false">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
