"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { RoleBasedRoute } from "@/components/auth/RoleBasedRoute"
import {
  Calendar,
  Clock,
  Heart,
  Activity,
  Users,
  MessageSquare,
  FileText,
  Stethoscope,
  MapPin,
  Star,
  Phone,
  Video,
  Download,
  Send,
  AlertTriangle,
  TrendingUp,
  Pill,
  UserPlus,
  Filter,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  ChevronRight,
  Eye,
  Edit,
  Mic,
  Camera,
  Wifi,
  WifiOff,
  Share2,
  Copy,
  Mail,
  MessageCircle,
  Check,
  Plus,
  PlayCircle,
  PauseCircle,
  VideoIcon,
  FileCheck,
  UserCheck,
  ClipboardList,
  Zap,
  Shield,
  Target,
  Sparkles,
  Globe,
  Headphones,
  Monitor,
  LogOut,
} from "lucide-react"

export default function DoctorDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLowBandwidth, setIsLowBandwidth] = useState(false)
  const [consultationActive, setConsultationActive] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const { user, logout } = useAuth()

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "consultation", label: "Consultation", icon: Video },
    { id: "records", label: "Records", icon: FileText },
    { id: "prescription", label: "Prescription", icon: Pill },
    { id: "feedback", label: "Feedback", icon: Star },
    { id: "outbreak", label: "Disease Monitor", icon: MapPin },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ]

  const todayAppointments = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 34,
      issue: "Chest Pain",
      time: "10:30 AM",
      urgent: true,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "pending",
    },
    {
      id: 2,
      name: "Raj Kumar",
      age: 45,
      issue: "Diabetes Check",
      time: "11:15 AM",
      urgent: false,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "pending",
    },
    {
      id: 3,
      name: "Anita Devi",
      age: 28,
      issue: "Pregnancy Care",
      time: "12:00 PM",
      urgent: false,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "pending",
    },
    {
      id: 4,
      name: "Mohan Singh",
      age: 52,
      issue: "Hypertension",
      time: "2:30 PM",
      urgent: false,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "pending",
    },
  ]

  const [appointments, setAppointments] = useState(todayAppointments)

  const emergencyCase = {
    name: "Ramesh Gupta",
    age: 58,
    issue: "Acute Chest Pain - Suspected MI",
    location: "Village Clinic, Sector 7",
  }

  const handleAppointmentAction = (id: number, action: string) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status: action } : apt)))
  }

  const handleLogout = async () => {
    try {
      toast.loading("Signing out...")
      await logout()
      toast.success("Signed out successfully!")
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const renderDashboard = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Emergency Case Highlight */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="p-3 bg-red-50 rounded-full"
                >
                  <Heart className="h-6 w-6 text-red-500" />
                </motion.div>
                <div>
                  <CardTitle className="text-red-700 text-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Emergency Case
                  </CardTitle>
                  <p className="text-red-600 text-sm flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    Requires immediate attention
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Badge variant="destructive" className="bg-red-500">
                  URGENT
                </Badge>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <UserCheck className="h-4 w-4 mr-2" />
                  {emergencyCase.name}, {emergencyCase.age}
                </h3>
                <p className="text-gray-600 flex items-center mt-1">
                  <Shield className="h-4 w-4 mr-2" />
                  {emergencyCase.issue}
                </p>
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {emergencyCase.location}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => setConsultationActive(true)}
              >
                <Video className="h-4 w-4 mr-2" />
                Start Consultation
              </Button>
              <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <Phone className="h-4 w-4 mr-2" />
                Call Patient
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, value: "12", label: "Patients Today", color: "blue", bgIcon: Monitor },
          { icon: FileText, value: "8", label: "Pending Reports", color: "purple", bgIcon: ClipboardList },
          { icon: MessageSquare, value: "5", label: "Unread Messages", color: "green", bgIcon: MessageCircle },
          { icon: TrendingUp, value: "94%", label: "Satisfaction", color: "orange", bgIcon: Target },
        ].map((stat, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="bg-white border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center relative overflow-hidden">
                <motion.div
                  className="absolute top-2 right-2 opacity-10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <stat.bgIcon className="h-8 w-8" />
                </motion.div>
                <stat.icon className={`h-8 w-8 text-${stat.color}-500 mx-auto mb-3`} />
                <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )

  return (
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={['doctor']}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b">
        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TeleSeva Doctor
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-sm border-r border-gray-200">
            {/* Header */}
            <div className="flex items-center px-6 py-4 border-b">
              <Heart className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TeleSeva
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User section */}
            {user && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Dr. {user.displayName || 'Doctor'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex-1">
          <main className="p-6">
            {activeSection === "dashboard" && renderDashboard()}
            {activeSection !== "dashboard" && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {navigationItems.find(item => item.id === activeSection)?.label}
                </h2>
                <p className="text-gray-600">This section is under development.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/20" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <Heart className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TeleSeva
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </RoleBasedRoute>
    </ProtectedRoute>
  )
}
