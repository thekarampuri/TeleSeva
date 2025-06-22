"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Cookies from 'js-cookie'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface RoleBasedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('patient' | 'doctor')[]
  redirectTo?: string
}

export function RoleBasedRoute({ 
  children, 
  allowedRoles = ['patient', 'doctor'], 
  redirectTo = '/auth' 
}: RoleBasedRouteProps) {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()
  const [isGuest, setIsGuest] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check both localStorage and cookies for user mode
    const userModeFromStorage = localStorage.getItem("userMode")
    const userModeFromCookie = Cookies.get("userMode")
    
    // Prefer cookie values over localStorage for better security
    setIsGuest(userModeFromCookie === "guest" || userModeFromStorage === "guest")
  }, [])

  useEffect(() => {
    if (!mounted || loading) return

    // If no user and not guest mode, redirect to auth
    if (!user && !isGuest) {
      router.push(redirectTo)
      return
    }

    // If user exists but role is not allowed, redirect
    if (user && userRole && !allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'doctor') {
        router.push('/doctor-dashboard')
      } else {
        router.push('/')
      }
      return
    }
  }, [user, userRole, loading, mounted, allowedRoles, redirectTo, router, isGuest])

  // Show loading while checking authentication
  if (!mounted || loading) {
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

  return <>{children}</>
}
