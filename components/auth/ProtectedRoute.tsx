"use client"

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isGuest, setIsGuest] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side before accessing localStorage
  useEffect(() => {
    setIsClient(true)
    const userMode = localStorage.getItem("userMode")
    setIsGuest(userMode === "guest")
  }, [])

  useEffect(() => {
    // Only redirect if we're on the client and not loading
    if (isClient && !loading && !user && !isGuest) {
      router.push('/auth')
    }
  }, [user, loading, router, isGuest, isClient])

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

  // If no user and not guest, return null (will redirect)
  if (!user && !isGuest) {
    return null
  }

  return <>{children}</>
}
