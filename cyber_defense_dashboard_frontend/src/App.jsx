import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Activity from './pages/Activity'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Layout from './components/Layout'
import { useAppStore } from './store/useAppStore'

function RequireAuth() {
  const user = useAppStore((s) => s.user)
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default function App() {
  const startSimulations = useAppStore((s) => s.startSimulations)

  React.useEffect(() => {
    startSimulations()
  }, [startSimulations])

  return (
    <Routes>
      {/* Public route - login, no layout */}
      <Route path="/login" element={<Login />} />
      {/* Private routes wrapped with Layout */}
      <Route element={<Layout />}>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
