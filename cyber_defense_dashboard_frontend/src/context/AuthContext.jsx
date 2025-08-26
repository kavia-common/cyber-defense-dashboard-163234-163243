import React, { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access authentication state (stub) and actions. */
  return useContext(AuthContext)
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides simple in-memory auth with role placeholders for future integration. */
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('auth_user')
    return cached ? JSON.parse(cached) : null
  })

  const login = (username, role = 'analyst') => {
    const u = { username, role }
    setUser(u)
    localStorage.setItem('auth_user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      role: user?.role ?? 'guest',
      // PUBLIC_INTERFACE
      login,
      // PUBLIC_INTERFACE
      logout,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
