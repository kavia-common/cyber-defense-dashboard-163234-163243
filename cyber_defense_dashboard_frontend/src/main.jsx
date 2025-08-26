import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './style.css'
import { useAppStore } from './store/useAppStore'

// Apply persisted theme class to <html>
function ThemeInitializer() {
  const darkMode = useAppStore((s) => s.darkMode)
  React.useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [darkMode])
  return null
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeInitializer />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
