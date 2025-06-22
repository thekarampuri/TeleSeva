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

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRoleState] = useState<'doctor' | 'patient' | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Set user role in both localStorage and cookies
  function setUserRole(role: 'patient' | 'doctor') {
    console.log(`Setting user role: ${role}`);
    localStorage.setItem("userRole", role)
    Cookies.set("userRole", role, { expires: 7 }) // Expires in 7 days
    setUserRoleState(role)
    console.log(`User role set in localStorage, cookies, and state: ${role}`);
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

  // Redirect to appropriate dashboard based on role
  function redirectToRoleDashboard(role: 'patient' | 'doctor') {
    console.log(`Redirecting to dashboard for role: ${role}`);

    // Use window.location.href for a full page redirect to avoid middleware conflicts
    if (role === 'doctor') {
      console.log('Redirecting to doctor dashboard');
      window.location.href = '/doctor-dashboard'
    } else {
      console.log('Redirecting to patient dashboard');
      window.location.href = '/'
    }
  }

  async function signup(email: string, password: string, name: string, role: 'doctor' | 'patient') {
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
  }

  async function login(email: string, password: string) {
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
      
      // Clear state
      setUserRoleState(null)
      
      // Redirect to auth page
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Check user role when user changes
  useEffect(() => {
    async function checkRole() {
      if (user) {
        try {
          // Get the user role from Firestore
          const role = await getUserRole(user.uid)
          
          if (role) {
            // Set the user role in state, localStorage, and cookies
            setUserRole(role)
          } else {
            // If no role is found, check localStorage and cookies
            const roleFromStorage = localStorage.getItem("userRole") as 'doctor' | 'patient' | null
            const roleFromCookie = Cookies.get("userRole") as 'doctor' | 'patient' | null
            
            const role = roleFromCookie || roleFromStorage
            if (role) {
              // If a role is found in localStorage or cookies, save it to Firestore
              await saveUserRole(user.uid, role, {
                email: user.email,
                name: user.displayName,
                createdAt: new Date(),
              })
              
              setUserRoleState(role)
            }
          }
        } catch (error) {
          console.error('Error checking user role:', error)
        }
      }
    }
    
    if (user) {
      checkRole()
    }
  }, [user])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      
      // Set or remove auth token cookie based on user state
      if (user?.refreshToken) {
        Cookies.set("authToken", user.refreshToken, { expires: 7 })
      } else {
        Cookies.remove("authToken")
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
