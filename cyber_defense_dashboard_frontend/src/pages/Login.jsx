import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('analyst')
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    login(username || 'analyst', role)
    navigate('/', { replace: true })
  }

  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <div className="mx-auto mt-10 max-w-md">
      <form onSubmit={onSubmit} className="card space-y-4" aria-labelledby="login-title">
        <div className="card-header">
          <h1 id="login-title" className="card-title">
            Sign in
          </h1>
        </div>
        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            className="input"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium">
            Role (placeholder)
          </label>
          <select id="role" className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="analyst">Analyst</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button type="submit" className="btn">
            Login
          </button>
        </div>
      </form>
    </div>
  )
}
