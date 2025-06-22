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
import { saveUserRole, getUserRole } from '@/services/userService'

interface AuthContextType {
  user: User | null
  userRole: 'doctor' | 'patient' | null
  loading: boolean
  signup: (email: string, password: string, name: string, role: 'doctor' | 'patient') => Promise<void>
  login: (email: string, password: string) => Promise<{ role: 'doctor' | 'patient' | null }>
  logout: () => Promise<void>
  setUserRole: (role: 'patient' | 'doctor') => void
  setGuestMode: (isGuest: boolean) => void
  redirectToRoleDashboard: (role: 'patient' | 'doctor') => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRoleState] = useState<'doctor' | 'patient' | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  function setUserRole(role: 'patient' | 'doctor') {
    localStorage.setItem("userRole", role)
    Cookies.set("userRole", role, { expires: 7 })
    setUserRoleState(role)
  }

  function setGuestMode(isGuest: boolean) {
    if (isGuest) {
      localStorage.setItem("userMode", "guest")
      Cookies.set("userMode", "guest", { expires: 1 })
    } else {
      localStorage.removeItem("userMode")
      Cookies.remove("userMode")
    }
  }

  function redirectToRoleDashboard(role: 'patient' | 'doctor') {
    if (role === 'doctor') {
      window.location.href = '/doctor-dashboard'
    } else {
      window.location.href = '/dashboard'
    }
  }

  async function signup(email: string, password: string, name: string, role: 'doctor' | 'patient') {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName: name })
    
    await saveUserRole(userCredential.user.uid, role, {
      email,
      name,
      createdAt: new Date(),
    })
    
    setUserRole(role)
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const role = await getUserRole(userCredential.user.uid)
    
    if (role) {
      setUserRole(role)
    }
    
    return { role }
  }

  async function logout() {
    try {
      await signOut(auth)
      localStorage.removeItem("userMode")
      localStorage.removeItem("userRole")
      Cookies.remove("authToken")
      Cookies.remove("userRole")
      Cookies.remove("userMode")
      setUserRoleState(null)
      router.push('/landing-page')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // MINIMAL useEffect - only handle auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    userRole,
    loading,
    signup,
    login,
    logout,
    setUserRole,
    setGuestMode,
    redirectToRoleDashboard
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
