import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Incidents from './pages/Incidents.jsx'
import Activity from './pages/Activity.jsx'
import Settings from './pages/Settings.jsx'
import Login from './pages/Login.jsx'

// PUBLIC_INTERFACE
export default function App() {
  /** Root of the SPA. Provides Theme and Auth contexts and sets up routes. */
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <Protected>
                  <Dashboard />
                </Protected>
              }
            />
            <Route
              path="/incidents"
              element={
                <Protected>
                  <Incidents />
                </Protected>
              }
            />
            <Route
              path="/activity"
              element={
                <Protected>
                  <Activity />
                </Protected>
              }
            />
            <Route
              path="/settings"
              element={
                <Protected>
                  <Settings />
                </Protected>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  )
}

function Protected({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}
