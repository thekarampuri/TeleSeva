"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

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
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const role = localStorage.getItem('userRole')
    setUserRole(role)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return

    // If no user and not guest mode, redirect to auth
    if (!user) {
      const userMode = localStorage.getItem('userMode')
      if (userMode !== 'guest') {
        router.push(redirectTo)
        return
      }
    }

    // If user exists but role is not allowed, redirect
    if (user && userRole && !allowedRoles.includes(userRole as 'patient' | 'doctor')) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'doctor') {
        router.push('/doctor-dashboard')
      } else {
        router.push('/')
      }
      return
    }
  }, [user, userRole, loading, mounted, allowedRoles, redirectTo, router])

  // Show loading while checking authentication
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
