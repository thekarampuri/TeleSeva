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

    // Set auth token cookie to indicate user is authenticated
    const token = await userCredential.user.getIdToken()
    Cookies.set("authToken", token, { expires: 7 })

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

    // Set auth token cookie to indicate user is authenticated
    const token = await userCredential.user.getIdToken()
    Cookies.set("authToken", token, { expires: 7 })

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

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // User is signed in, set auth token and get role
        try {
          const token = await user.getIdToken()
          Cookies.set("authToken", token, { expires: 7 })

          const role = await getUserRole(user.uid)
          if (role) {
            setUserRole(role)
          }
        } catch (error) {
          console.error('Error setting auth token:', error)
        }
      } else {
        // User is signed out, clear cookies
        Cookies.remove("authToken")
        Cookies.remove("userRole")
        setUserRoleState(null)
      }

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
