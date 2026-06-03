import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEFAULT_USERS = {
  member: {
    username: 'member@healthbridge.com',
    password: 'Member@123',
    type: 'member',
    name: 'John Smith',
    memberId: 'HB-2024-001',
    plan: 'Gold PPO',
  },
  provider: {
    username: 'provider@healthbridge.com',
    password: 'Provider@123',
    type: 'provider',
    name: 'Dr. Sarah Johnson',
    npi: '1234567890',
    specialty: 'Internal Medicine',
  },
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hb_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (username, password, userType) => {
    const user = DEFAULT_USERS[userType]
    if (user && user.username === username && user.password === password) {
      const { password: _pw, ...safeUser } = user
      setCurrentUser(safeUser)
      localStorage.setItem('hb_user', JSON.stringify(safeUser))
      return { success: true, user: safeUser }
    }
    return { success: false, error: 'Invalid credentials. Please try again.' }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('hb_user')
  }

  const isAuthenticated = Boolean(currentUser)

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
