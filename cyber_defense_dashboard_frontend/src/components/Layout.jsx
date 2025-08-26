import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-full grid grid-rows-[auto,1fr,auto]">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-4 p-4 md:p-6">
        <aside className="hidden md:block">
          <Sidebar />
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
