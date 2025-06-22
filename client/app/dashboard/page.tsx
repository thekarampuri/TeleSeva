"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { RoleBasedRoute } from "@/components/auth/RoleBasedRoute"
import {
  Stethoscope,
  Bot,
  Pill,
  Phone,
  MapPin,
  Video,
  Mic,
  MessageCircle,
  Star,
  Clock,
  Users,
  Zap,
  ArrowRight,
  Shield,
  Heart,
  Activity,
  Sparkles,
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
    gradient: "bg-gradient-to-br from-blue-50 to-blue-100",
  },
  {
    title: "Symptom Checker Bot",
    description: "AI-powered health assessment in your language",
    icon: Bot,
    href: "/symptom-checker",
    color: "from-purple-500 to-purple-600",
    badge: "Voice Support",
    gradient: "bg-gradient-to-br from-purple-50 to-purple-100",
  },
  {
    title: "Medicine Delivery",
    description: "Order medicines with prescription upload",
    icon: Pill,
    href: "/medicine",
    color: "from-green-500 to-green-600",
    badge: "Same Day",
    gradient: "bg-gradient-to-br from-green-50 to-green-100",
  },
  {
    title: "Emergency",
    description: "SOS button for immediate help",
    icon: Phone,
    href: "/emergency",
    color: "from-red-500 to-red-600",
    badge: "24/7",
    gradient: "bg-gradient-to-br from-red-50 to-red-100",
  },
  {
    title: "Health Facility Finder",
    description: "Find nearby hospitals and clinics",
    icon: MapPin,
    href: "/facility-finder",
    color: "from-teal-500 to-teal-600",
    badge: "GPS Enabled",
    gradient: "bg-gradient-to-br from-teal-50 to-teal-100",
  },
]

const consultationModes = [
  { icon: Video, label: "Video Call", available: 12, color: "text-blue-600" },
  { icon: Mic, label: "Audio Call", available: 8, color: "text-green-600" },
  { icon: MessageCircle, label: "Chat", available: 15, color: "text-purple-600" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function DashboardPage() {
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
    <ProtectedRoute requiredRole="patient">
      <MainLayout>
          <motion.div
            className="p-6 space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center space-y-6 py-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-700 mb-4"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Your Health, Our Priority
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to TeleSeva
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your comprehensive healthcare companion. Access quality medical care from the comfort of your home with our advanced telemedicine platform.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 hover:border-blue-500 px-8 py-3 rounded-full transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Doctors Available</p>
                    <p className="text-4xl font-bold mt-2">35+</p>
                    <p className="text-blue-200 text-xs mt-1">Online now</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Avg Response Time</p>
                    <p className="text-4xl font-bold mt-2">2 min</p>
                    <p className="text-purple-200 text-xs mt-1">Lightning fast</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Patient Satisfaction</p>
                    <p className="text-4xl font-bold mt-2">4.8★</p>
                    <p className="text-green-200 text-xs mt-1">Highly rated</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div variants={itemVariants}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services designed to meet all your medical needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayActions.map((action, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
                onClick={() => !action.disabled && (window.location.href = action.href)}
              >
                <Card className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${action.gradient} ${action.disabled ? 'opacity-60' : ''}`}>
                  <CardHeader className="pb-4 relative">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className={`p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white shadow-lg`}
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <action.icon className="h-7 w-7" />
                      </motion.div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium bg-white/80 backdrop-blur-sm"
                      >
                        {action.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300"
                    >
                      {action.disabled ? 'Sign up required' : 'Get Started'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>
            </motion.div>
        </motion.div>
      </MainLayout>
    </ProtectedRoute>
  )
}