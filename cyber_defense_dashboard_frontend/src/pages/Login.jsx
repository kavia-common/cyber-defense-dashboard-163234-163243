import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function Login() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const login = useAppStore((s) => s.login)
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    // Mocked authentication: any non-empty username/password
    if (username.trim() && password.trim()) {
      login(username.trim())
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form onSubmit={onSubmit} className="card w-full max-w-md" aria-labelledby="login-title">
        <div className="card-header">
          <h1 id="login-title" className="card-title">Sign in</h1>
        </div>
        <div className="card-content space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
            <input
              id="username"
              name="username"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn-primary w-full" type="submit">Sign in</button>
          <p className="text-xs text-gray-500">This is a demo login; no data is sent to a server.</p>
        </div>
      </form>
    </div>
  )
}
