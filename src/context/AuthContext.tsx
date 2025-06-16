import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '@/services/api'

interface User {
  id: number
  name: string
  email: string
  phoneNumber: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: {
    name: string
    email: string
    password: string
    phoneNumber: string
  }) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in on app start
    const currentUser = authAPI.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password)
    setUser(response.user)
  }

  const signup = async (userData: {
    name: string
    email: string
    password: string
    phoneNumber: string
  }) => {
    const response = await authAPI.signup(userData)
    setUser(response.user)
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
