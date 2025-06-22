"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
]

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const pathname = usePathname()

  // Check if user is in guest mode
  useEffect(() => {
    const userMode = localStorage.getItem("userMode")
    setIsGuest(userMode === "guest")
  }, [])

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
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-sm border-r border-gray-200">
          <div className="flex items-center px-6 py-4 border-b">
            <Heart className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TeleSeva
            </span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
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
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                  {item.name === "Notifications" && <Badge className="ml-auto bg-red-500 text-white">3</Badge>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
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
