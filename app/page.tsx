"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import {
  Stethoscope,
  Bot,
  Pill,
  BookOpen,
  Phone,
  MapPin,
  Video,
  Mic,
  MessageCircle,
  Star,
  Clock,
  Users,
  Zap,
} from "lucide-react"
import { useState, useEffect } from "react"

const quickActions = [
  {
    title: "Book Doctor Consultation",
    description: "Connect with certified doctors instantly",
    icon: Stethoscope,
    href: "/consultation",
    color: "from-blue-500 to-blue-600",
    badge: "Available Now",
  },
  {
    title: "Symptom Checker Bot",
    description: "AI-powered health assessment in your language",
    icon: Bot,
    href: "/symptom-checker",
    color: "from-purple-500 to-purple-600",
    badge: "Voice Support",
  },
  {
    title: "Medicine Delivery",
    description: "Order medicines with prescription upload",
    icon: Pill,
    href: "/medicine",
    color: "from-green-500 to-green-600",
    badge: "Same Day",
  },
  {
    title: "Health Tips",
    description: "Educational videos and articles",
    icon: BookOpen,
    href: "/health-tips",
    color: "from-orange-500 to-orange-600",
    badge: "Offline Mode",
  },
  {
    title: "Emergency",
    description: "SOS button for immediate help",
    icon: Phone,
    href: "/emergency",
    color: "from-red-500 to-red-600",
    badge: "24/7",
  },
  {
    title: "Health Facility Finder",
    description: "Find nearby hospitals and clinics",
    icon: MapPin,
    href: "/facility-finder",
    color: "from-teal-500 to-teal-600",
    badge: "GPS Enabled",
  },
]

const consultationModes = [
  { icon: Video, label: "Video Call", available: 12 },
  { icon: Mic, label: "Audio Call", available: 8 },
  { icon: MessageCircle, label: "Chat", available: 15 },
]

export default function HomePage() {
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    const userMode = localStorage.getItem("userMode")
    setIsGuest(userMode === "guest")
  }, [])

  // Modify quickActions to show different actions for guests
  const guestRestrictedActions = ["Book Doctor Consultation", "Medicine Delivery"]

  const displayActions = quickActions.map((action) => ({
    ...action,
    disabled: isGuest && guestRestrictedActions.includes(action.title),
    badge: isGuest && guestRestrictedActions.includes(action.title) ? "Sign up required" : action.badge,
  }))
  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to TeleSeva
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive healthcare companion. Access quality medical care from the comfort of your home.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Doctors Available</p>
                  <p className="text-3xl font-bold">35+</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Avg Response Time</p>
                  <p className="text-3xl font-bold">2 min</p>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Patient Satisfaction</p>
                  <p className="text-3xl font-bold">4.8★</p>
                </div>
                <Star className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayActions.map((action, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{action.title}</CardTitle>
                  <CardDescription className="text-sm">{action.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className={`w-full bg-gradient-to-r ${action.color} hover:opacity-90 transition-opacity`}
                    onClick={() => (window.location.href = action.href)}
                    disabled={action.disabled}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Consultation Modes */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Instant Consultation Available
            </CardTitle>
            <CardDescription>Choose your preferred consultation mode</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {consultationModes.map((mode, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <mode.icon className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="font-medium">{mode.label}</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {mode.available} available
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Quick Access */}
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Emergency Services</h3>
                <p className="text-red-100">24/7 emergency support available</p>
              </div>
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-red-50"
                onClick={() => (window.location.href = "/emergency")}
              >
                <Phone className="h-5 w-5 mr-2" />
                SOS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
