import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Restore user from localStorage on first load
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('authUser')
    return stored ? JSON.parse(stored) : null
  })

  const isAuthenticated = !!user

  // Keeps localStorage in sync with auth state
  useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('authUser')
    }
  }, [user])

  // A simple “fake” login – any non-empty username/password works
  const login = (username) => {
    const userData = { username }
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
