"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
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

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRoleState] = useState<'doctor' | 'patient' | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  // Set user role in both localStorage and cookies
  const setUserRole = useCallback((role: 'patient' | 'doctor') => {
    console.log(`Setting user role: ${role}`);
    localStorage.setItem("userRole", role)
    Cookies.set("userRole", role, { expires: 7 }) // Expires in 7 days
    setUserRoleState(role)
    console.log(`User role set in localStorage, cookies, and state: ${role}`);
  }, [])

  // Set guest mode in both localStorage and cookies
  const setGuestMode = useCallback((isGuest: boolean) => {
    if (isGuest) {
      localStorage.setItem("userMode", "guest")
      Cookies.set("userMode", "guest", { expires: 1 }) // Expires in 1 day
    } else {
      localStorage.removeItem("userMode")
      Cookies.remove("userMode")
    }
  }, [])

  // Redirect to appropriate dashboard based on role
  const redirectToRoleDashboard = useCallback((role: 'patient' | 'doctor') => {
    console.log(`Redirecting to dashboard for role: ${role}`);

    // Use window.location.href for a full page redirect to avoid middleware conflicts
    if (role === 'doctor') {
      console.log('Redirecting to doctor dashboard');
      window.location.href = '/doctor-dashboard'
    } else {
      console.log('Redirecting to patient dashboard');
      window.location.href = '/dashboard'
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string, role: 'doctor' | 'patient') => {
    console.log(`Signing up user with email: ${email}, name: ${name}, role: ${role}`);

    // Create the user in Firebase Auth
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    console.log(`User created with UID: ${user.uid}`);

    // Update the user profile with the name
    await updateProfile(user, { displayName: name })
    console.log(`User profile updated with name: ${name}`);

    // Save the user role in Firestore
    await saveUserRole(user.uid, role, {
      email,
      name,
      createdAt: new Date(),
    })
    console.log(`User role saved in Firestore: ${role}`);

    // Set the user role in state, localStorage, and cookies
    setUserRole(role)
    console.log(`User role set in state, localStorage, and cookies: ${role}`);

    // Set auth token in cookies
    if (user.refreshToken) {
      Cookies.set("authToken", user.refreshToken, { expires: 7 })
      console.log(`Auth token set in cookies`);
    }
  }, [setUserRole])

  const login = useCallback(async (email: string, password: string) => {
    console.log(`Logging in user with email: ${email}`);

    // Sign in the user with Firebase Auth
    const result = await signInWithEmailAndPassword(auth, email, password)
    console.log(`User logged in with UID: ${result.user.uid}`);

    // Get the user role from Firestore
    const role = await getUserRole(result.user.uid)
    console.log(`Retrieved user role from Firestore: ${role || 'null'}`);

    // Set the user role in state, localStorage, and cookies
    if (role) {
      setUserRole(role)
      console.log(`User role set in state, localStorage, and cookies: ${role}`);
    } else {
      console.log(`No role found for user ${result.user.uid} in Firestore`);
    }

    // Set auth token in cookies
    if (result.user.refreshToken) {
      Cookies.set("authToken", result.user.refreshToken, { expires: 7 })
      console.log(`Auth token set in cookies`);
    }

    return { role }
  }, [setUserRole])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
      // Clear any stored user data
      localStorage.removeItem("userMode")
      localStorage.removeItem("userRole")

      // Clear cookies
      Cookies.remove("authToken")
      Cookies.remove("userRole")
      Cookies.remove("userMode")

      // Clear state
      setUserRoleState(null)

      // Redirect to landing page
      router.push('/landing-page')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [router])

  // Initialize user role from localStorage/cookies on mount
  useEffect(() => {
    const roleFromStorage = localStorage.getItem("userRole") as 'doctor' | 'patient' | null
    const roleFromCookie = Cookies.get("userRole") as 'doctor' | 'patient' | null
    const role = roleFromCookie || roleFromStorage

    if (role) {
      setUserRoleState(role)
    }

    setIsInitialized(true)
  }, [])

  // Check user role when user changes (only once per user)
  useEffect(() => {
    let isMounted = true

    async function checkRole() {
      if (user && isInitialized && !userRole) {
        try {
          console.log(`Checking role for user: ${user.uid}`)
          const role = await getUserRole(user.uid)

          if (isMounted) {
            if (role) {
              console.log(`Found role in Firestore: ${role}`)
              localStorage.setItem("userRole", role)
              Cookies.set("userRole", role, { expires: 7 })
              setUserRoleState(role)
            } else {
              console.log(`No role found in Firestore for user: ${user.uid}`)
            }
          }
        } catch (error) {
          console.error('Error checking user role:', error)
        }
      }
    }

    if (user && isInitialized && !userRole) {
      checkRole()
    }

    return () => {
      isMounted = false
    }
  }, [user?.uid, isInitialized]) // Removed userRole from dependencies to prevent infinite loop

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid || 'null')

      setUser(firebaseUser)

      // Set or remove auth token cookie based on user state
      if (firebaseUser?.refreshToken) {
        Cookies.set("authToken", firebaseUser.refreshToken, { expires: 7 })
      } else {
        // User logged out - clear everything
        Cookies.remove("authToken")
        Cookies.remove("userRole")
        localStorage.removeItem("userRole")
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
