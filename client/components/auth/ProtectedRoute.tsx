"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Cookies from 'js-cookie'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'patient' | 'doctor' | null
}

export function ProtectedRoute({ children, requiredRole = null }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isGuest, setIsGuest] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side before accessing localStorage and cookies
  useEffect(() => {
    setIsClient(true)
    
    // Check both localStorage and cookies for user mode and role
    const userModeFromStorage = localStorage.getItem("userMode")
    const userModeFromCookie = Cookies.get("userMode")
    
    const userRoleFromStorage = localStorage.getItem("userRole")
    const userRoleFromCookie = Cookies.get("userRole")
    
    // Prefer cookie values over localStorage for better security
    setIsGuest(userModeFromCookie === "guest" || userModeFromStorage === "guest")
    setUserRole(userRoleFromCookie || userRoleFromStorage)
  }, [])

  useEffect(() => {
    // Only redirect if we're on the client and not loading
    if (isClient && !loading) {
      // If no user and not guest, redirect to auth
      if (!user && !isGuest) {
        router.push('/auth')
        return
      }
      
      // If requiredRole is specified, check if user has that role
      if (requiredRole && userRole !== requiredRole) {
        // Redirect based on actual role
        if (userRole === 'doctor') {
          router.push('/doctor-dashboard')
        } else if (userRole === 'patient' || isGuest) {
          router.push('/')
        } else {
          router.push('/auth')
        }
      }
    }
  }, [user, loading, router, isGuest, isClient, userRole, requiredRole])

  // Show loading screen while Firebase is initializing or while checking client state
  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4"
          >
            <Heart className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TeleSeva
          </h2>
          <p className="text-gray-600 mt-2">Loading your health dashboard...</p>
        </motion.div>
      </div>
    )
  }

  // If no user and not guest, or if role requirement not met, return null (will redirect)
  if ((!user && !isGuest) || (requiredRole && userRole !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
