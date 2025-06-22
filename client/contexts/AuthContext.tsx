"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUserRole: (role: 'patient' | 'doctor') => void
  setGuestMode: (isGuest: boolean) => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Set user role in both localStorage and cookies
  function setUserRole(role: 'patient' | 'doctor') {
    localStorage.setItem("userRole", role)
    Cookies.set("userRole", role, { expires: 7 }) // Expires in 7 days
  }

  // Set guest mode in both localStorage and cookies
  function setGuestMode(isGuest: boolean) {
    if (isGuest) {
      localStorage.setItem("userMode", "guest")
      Cookies.set("userMode", "guest", { expires: 1 }) // Expires in 1 day
    } else {
      localStorage.removeItem("userMode")
      Cookies.remove("userMode")
    }
  }

  async function signup(email: string, password: string, name: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName: name })
    
    // Set auth token in cookies
    if (user.refreshToken) {
      Cookies.set("authToken", user.refreshToken, { expires: 7 })
    }
  }

  async function login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    
    // Set auth token in cookies
    if (result.user.refreshToken) {
      Cookies.set("authToken", result.user.refreshToken, { expires: 7 })
    }
    
    return result
  }

  async function logout() {
    try {
      await signOut(auth)
      // Clear any stored user data
      localStorage.removeItem("userMode")
      localStorage.removeItem("userRole")
      
      // Clear cookies
      Cookies.remove("authToken")
      Cookies.remove("userRole")
      Cookies.remove("userMode")
      
      // Redirect to auth page
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      
      // Set or remove auth token cookie based on user state
      if (user?.refreshToken) {
        Cookies.set("authToken", user.refreshToken, { expires: 7 })
      } else {
        Cookies.remove("authToken")
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    setUserRole,
    setGuestMode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
