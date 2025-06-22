"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Home,
  Stethoscope,
  Bot,
  Pill,
  BookOpen,
  Trophy,
  AlertTriangle,
  Phone,
  Bell,
  FileText,
  Menu,
  X,
  Heart,
  User,
  MapPin,
  LogOut,
  Settings,
  Plus,
  Calendar,
  Mail,
  ChevronRight,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Consultation", href: "/consultation", icon: Stethoscope },
  { name: "Symptom Checker", href: "/symptom-checker", icon: Bot },
  { name: "Medicine", href: "/medicine", icon: Pill },
  { name: "Health Tips", href: "/health-tips", icon: BookOpen },
  { name: "Gamification", href: "/gamification", icon: Trophy },
  { name: "Disease Alerts", href: "/disease-alerts", icon: AlertTriangle },
  { name: "Emergency", href: "/emergency", icon: Phone },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Facility Finder", href: "/facility-finder", icon: MapPin },
]

const sidebarVariants = {
  open: {
    width: "280px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    width: "80px",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
}

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Check if user is in guest mode and handle role-based redirection
  useEffect(() => {
    const userMode = localStorage.getItem("userMode")
    const userRole = localStorage.getItem("userRole")

    setIsGuest(userMode === "guest")
    setMounted(true)

    // If user is logged in and is a doctor, redirect to doctor dashboard
    if (user && userRole === "doctor" && pathname !== "/doctor-dashboard") {
      router.push("/doctor-dashboard")
    }
  }, [user, pathname, router])

  // Add guest banner after the mobile header
  const guestBanner = isGuest && (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 text-center">
      <div className="flex items-center justify-center space-x-2">
        <User className="h-4 w-4" />
        <span className="text-sm">You're browsing as a guest.</span>
        <Link href="/auth" className="underline hover:no-underline">
          Sign up for full access
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TeleSeva
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                  {item.name === "Notifications" && <Badge className="ml-auto bg-red-500 text-white">3</Badge>}
                </Link>
              )
            })}
          </nav>

          {/* Mobile User section */}
          {user && (
            <div className="p-4 border-t border-gray-200 mt-auto">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={async () => {
                  try {
                    toast.loading("Signing out...")
                    await logout()
                    setSidebarOpen(false)
                    toast.success("Signed out successfully!")
                  } catch (error) {
                    toast.error("Failed to sign out")
                  }
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop sidebar */}
      <motion.div
        className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col z-40"
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        initial="open"
      >
        <div className="flex flex-col flex-grow bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      TeleSeva
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </motion.button>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 ${
                      isActive ? "bg-white/20" : "bg-gray-100"
                    }`}>
                      <item.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-600"}`} />
                    </div>

                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex items-center justify-between flex-1"
                        >
                          <span>{item.name}</span>
                          {item.name === "Notifications" && (
                            <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                              3
                            </Badge>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* User section */}
          {user && (
            <motion.div
              className="p-4 border-t border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence>
                {sidebarOpen ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.displayName?.charAt(0) || user.email?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={async () => {
                        try {
                          toast.loading("Signing out...")
                          await logout()
                          toast.success("Signed out successfully!")
                        } catch (error) {
                          toast.error("Failed to sign out")
                        }
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={async () => {
                        try {
                          toast.loading("Signing out...")
                          await logout()
                          toast.success("Signed out successfully!")
                        } catch (error) {
                          toast.error("Failed to sign out")
                        }
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${mounted ? (sidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-[80px]') : 'lg:pl-[280px]'}`}>
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TeleSeva
            </span>
          </div>
          <div className="w-8" />
        </div>

        {/* Page content */}
        {guestBanner}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
