import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Activity from './pages/Activity'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Layout from './components/Layout'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const user = useAppStore((s) => s.user)
  const startSimulations = useAppStore((s) => s.startSimulations)

  React.useEffect(() => {
    startSimulations()
  }, [startSimulations])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/activity"
          element={user ? <Activity /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
