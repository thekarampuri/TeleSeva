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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "lucide-react"

export default function TeleSevaPortal() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLowBandwidth, setIsLowBandwidth] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [consultationActive, setConsultationActive] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [isOnline, setIsOnline] = useState(false)
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'busy' | 'in-consultation' | 'offline'>('offline')
  const [doctorAppointments, setDoctorAppointments] = useState<any[]>([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(true)
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicine: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    genericAlternative: false,
  })

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

  const handleAppointmentAction = async (appointmentId: string, status: string) => {
    try {
      // This would be implemented with Firebase
      console.log(`Updating appointment ${appointmentId} to status: ${status}`)
      // await consultationBookingService.updateAppointmentStatus(appointmentId, status, doctorId)

      // Update local state for immediate feedback
      setDoctorAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      )
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://teleseva.com/prescription/12345")
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handlePrescriptionSubmit = () => {
    console.log("Prescription submitted:", prescriptionForm)
    // Reset form
    setPrescriptionForm({
      medicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      genericAlternative: false,
    })
  }

  const shareOptions = [
    { name: "WhatsApp", icon: MessageCircle, color: "bg-green-500", action: () => console.log("Share to WhatsApp") },
    { name: "Email", icon: Mail, color: "bg-blue-500", action: () => console.log("Share via Email") },
    { name: "SMS", icon: MessageSquare, color: "bg-purple-500", action: () => console.log("Share via SMS") },
    { name: "Copy Link", icon: Copy, color: "bg-gray-500", action: handleCopyLink },
  ]

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
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
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
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
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
                  className={`absolute top-2 right-2 opacity-10`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
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

      {/* Today's Appointments Timeline */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white border-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Today's Schedule</span>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 border border-gray-100"
                >
                  <Avatar className="ring-2 ring-blue-100">
                    <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {appointment.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium flex items-center">
                        <UserCheck className="h-4 w-4 mr-1 text-green-500" />
                        {appointment.name}
                      </h4>
                      <span className="text-sm text-gray-500">({appointment.age}y)</span>
                      {appointment.urgent && (
                        <Badge variant="destructive" className="text-xs bg-red-100 text-red-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                      {appointment.status !== "pending" && (
                        <Badge variant="outline" className="text-xs">
                          {appointment.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Stethoscope className="h-3 w-3 mr-1" />
                      {appointment.issue}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {appointment.time}
                    </div>
                    <Button size="sm" variant="ghost" className="mt-1 hover:bg-blue-100">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderAppointments = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
      >
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-blue-500" />
          Appointment Management
          <Globe className="h-5 w-5 ml-2 text-green-500" />
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="hover:bg-blue-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-green-50">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </motion.div>

      {appointmentsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading appointments...</span>
        </div>
      ) : doctorAppointments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No appointments scheduled</p>
            <p className="text-sm">New appointments will appear here</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {doctorAppointments.map((appointment, index) => (
            <motion.div key={appointment.id} variants={itemVariants} whileHover={{ scale: 1.02 }} className="group">
              <Card className="bg-white border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-md hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {appointment.patientDetails.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg flex items-center">
                          <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                          {appointment.patientDetails.name}
                        </h3>
                        <p className="text-gray-600 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {appointment.patientDetails.age ? `Age: ${appointment.patientDetails.age}` : 'Age: N/A'} •
                          <Stethoscope className="h-4 w-4 ml-2 mr-1" />
                          {appointment.symptoms || 'General consultation'}
                        </p>
                        <p className="text-sm text-blue-600 font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.appointmentDate.toLocaleDateString()} at {appointment.appointmentTime}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {appointment.type}
                          </Badge>
                          <span className="text-sm text-green-600 font-medium">
                            ₹{appointment.payment.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {appointment.status === "pending" ? (
                        <>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4"
                              onClick={() => handleAppointmentAction(appointment.id, "confirmed")}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50 rounded-full px-4"
                              onClick={() => handleAppointmentAction(appointment.id, "cancelled")}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </motion.div>
                        </>
                      ) : (
                        <Badge
                          variant="outline"
                          className={`px-4 py-2 ${
                            appointment.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                            appointment.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            appointment.status === 'completed' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                            appointment.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                            ''
                          }`}
                        >
                          {appointment.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )

  const renderConsultation = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Video className="h-6 w-6 mr-2 text-blue-500" />
          Consultation Interface
          <Headphones className="h-5 w-5 ml-2 text-purple-500" />
        </h2>
        <div className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isLowBandwidth ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLowBandwidth(!isLowBandwidth)}
              className={isLowBandwidth ? "bg-orange-500 hover:bg-orange-600" : "hover:bg-orange-50"}
            >
              {isLowBandwidth ? <WifiOff className="h-4 w-4 mr-2" /> : <Wifi className="h-4 w-4 mr-2" />}
              {isLowBandwidth ? "Low Bandwidth" : "Normal Mode"}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video/Chat Window */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-gray-900 to-blue-900 text-white shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-blue-800 rounded-t-lg flex items-center justify-center relative">
                <AnimatePresence>
                  {consultationActive ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="text-center"
                    >
                      {isLowBandwidth ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                          >
                            <Headphones className="h-16 w-16 mx-auto mb-4 text-green-300" />
                          </motion.div>
                          <p className="text-green-200">Audio consultation active</p>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                          >
                            <VideoIcon className="h-16 w-16 mx-auto mb-4 text-green-300" />
                          </motion.div>
                          <p className="text-green-200">Video consultation active</p>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                      <PlayCircle className="h-16 w-16 mx-auto mb-4 text-blue-300" />
                      <p className="text-blue-200">Click to start consultation</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-4 flex justify-between items-center bg-gray-800/50 backdrop-blur-sm">
                <div className="flex space-x-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`text-white hover:bg-white/20 ${micEnabled ? "bg-green-500/20" : "bg-red-500/20"}`}
                      onClick={() => setMicEnabled(!micEnabled)}
                    >
                      <Mic className={`h-4 w-4 ${micEnabled ? "text-green-300" : "text-red-300"}`} />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`text-white hover:bg-white/20 ${cameraEnabled ? "bg-green-500/20" : "bg-red-500/20"}`}
                      onClick={() => setCameraEnabled(!cameraEnabled)}
                    >
                      <Camera className={`h-4 w-4 ${cameraEnabled ? "text-green-300" : "text-red-300"}`} />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    className={consultationActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                    onClick={() => setConsultationActive(!consultationActive)}
                  >
                    {consultationActive ? (
                      <>
                        <PauseCircle className="h-4 w-4 mr-2" />
                        End Call
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Call
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Add Health Buddy FAB */}
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
          >
            <Button className="rounded-full h-14 w-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
              <UserPlus className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* AI Symptom Summary */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-white border-purple-100 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-purple-700 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Symptom Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                >
                  <p className="text-sm text-gray-700 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                    Patient reports chest discomfort, shortness of breath
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-purple-50 p-3 rounded-lg border border-purple-100"
                >
                  <p className="text-sm text-purple-700 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    AI suggests: Consider cardiac evaluation
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Patient Vitals */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-white border-green-100 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-700 flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Recent Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Blood Pressure", value: "120/80", icon: Heart },
                  { label: "Heart Rate", value: "72 bpm", icon: Activity },
                  { label: "Temperature", value: "98.6°F", icon: Target },
                  { label: "SpO2", value: "98%", icon: Monitor },
                ].map((vital, index) => (
                  <motion.div
                    key={vital.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center text-sm p-2 rounded bg-gray-50"
                  >
                    <span className="flex items-center">
                      <vital.icon className="h-3 w-3 mr-2 text-green-500" />
                      {vital.label}:
                    </span>
                    <span className="font-medium">{vital.value}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Notes Panel */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-white border-gray-100 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  Consultation Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add your notes here..."
                  className="min-h-[100px] bg-gray-50 border-gray-200 focus:border-blue-300"
                />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="sm" className="mt-2 w-full bg-blue-500 hover:bg-blue-600">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )

  const renderRecords = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-blue-500" />
          Medical Records Viewer
          <Globe className="h-5 w-5 ml-2 text-green-500" />
        </h2>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { type: "X-Ray", name: "Chest X-Ray Report", date: "2024-01-15", icon: Eye, color: "blue" },
          { type: "Lab", name: "Blood Test Results", date: "2024-01-12", icon: FileText, color: "green" },
          { type: "MRI", name: "Brain MRI Scan", date: "2024-01-10", icon: Activity, color: "purple" },
          { type: "Prescription", name: "Current Medications", date: "2024-01-08", icon: Pill, color: "orange" },
        ].map((record, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-md hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`p-2 bg-${record.color}-50 rounded-full`}
                  >
                    <record.icon className={`h-5 w-5 text-${record.color}-500`} />
                  </motion.div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {record.type}
                    </Badge>
                  </div>
                </div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                  {record.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {record.date}
                </p>
                <div className="flex space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full hover:bg-blue-50">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" variant="outline" className="hover:bg-green-50">
                      <Download className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Visit Timeline */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white border-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Visit Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2024-01-15", type: "Follow-up", notes: "Patient showing improvement", icon: TrendingUp },
                {
                  date: "2024-01-08",
                  type: "Initial Consultation",
                  notes: "Diagnosed with hypertension",
                  icon: Stethoscope,
                },
                { date: "2023-12-20", type: "Health Checkup", notes: "Routine examination completed", icon: Shield },
              ].map((visit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-300"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, delay: index * 0.5 }}
                    className="w-3 h-3 bg-blue-500 rounded-full mt-2"
                  ></motion.div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <visit.icon className="h-4 w-4 mr-2 text-blue-500" />
                          {visit.type}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {visit.notes}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {visit.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderPrescription = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Pill className="h-6 w-6 mr-2 text-blue-500" />
          Prescription Composer
          <Sparkles className="h-5 w-5 ml-2 text-yellow-500" />
        </h2>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-white border-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-green-500" />
              Create New Prescription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Pill className="h-4 w-4 mr-2 text-blue-500" />
                  Medicine Name
                </label>
                <Input
                  placeholder="Enter medicine name"
                  className="bg-gray-50 border-gray-200 focus:border-blue-300"
                  value={prescriptionForm.medicine}
                  onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, medicine: e.target.value }))}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-green-500" />
                  Dosage
                </label>
                <Input
                  placeholder="e.g., 500mg"
                  className="bg-gray-50 border-gray-200 focus:border-blue-300"
                  value={prescriptionForm.dosage}
                  onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, dosage: e.target.value }))}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-purple-500" />
                  Frequency
                </label>
                <Input
                  placeholder="e.g., Twice daily"
                  className="bg-gray-50 border-gray-200 focus:border-blue-300"
                  value={prescriptionForm.frequency}
                  onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, frequency: e.target.value }))}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                  Duration
                </label>
                <Input
                  placeholder="e.g., 7 days"
                  className="bg-gray-50 border-gray-200 focus:border-blue-300"
                  value={prescriptionForm.duration}
                  onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, duration: e.target.value }))}
                />
              </motion.div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                Instructions
              </label>
              <Textarea
                placeholder="Additional instructions for the patient..."
                className="bg-gray-50 border-gray-200 focus:border-blue-300"
                value={prescriptionForm.instructions}
                onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, instructions: e.target.value }))}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="generic"
                className="rounded"
                checked={prescriptionForm.genericAlternative}
                onChange={(e) => setPrescriptionForm((prev) => ({ ...prev, genericAlternative: e.target.checked }))}
              />
              <label htmlFor="generic" className="text-sm flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                Suggest Generic Alternative
              </label>
            </motion.div>

            <div className="flex space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  onClick={handlePrescriptionSubmit}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to Patient & Pharmacy
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="hover:bg-green-50">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </motion.div>
              <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="hover:bg-blue-50">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Share2 className="h-5 w-5 mr-2 text-blue-500" />
                      Share Prescription
                    </DialogTitle>
                    <DialogDescription>Choose how you'd like to share this prescription</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {shareOptions.map((option, index) => (
                      <motion.div
                        key={option.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full h-20 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50"
                          onClick={option.action}
                        >
                          <div className={`p-2 rounded-full ${option.color} text-white`}>
                            <option.icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs">{option.name}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <AnimatePresence>
                    {copiedLink && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center text-green-600 text-sm"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Link copied to clipboard!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Prescriptions */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white border-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Recent Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { patient: "Priya Sharma", medicine: "Paracetamol 500mg", date: "2024-01-15" },
                { patient: "Raj Kumar", medicine: "Metformin 850mg", date: "2024-01-14" },
                { patient: "Anita Devi", medicine: "Folic Acid 5mg", date: "2024-01-13" },
              ].map((prescription, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-300"
                >
                  <div>
                    <h4 className="font-medium flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                      {prescription.patient}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Pill className="h-3 w-3 mr-1" />
                      {prescription.medicine}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {prescription.date}
                    </p>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button size="sm" variant="ghost" className="hover:bg-blue-100">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderFeedback = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Star className="h-6 w-6 mr-2 text-yellow-500" />
          Patient Feedback
          <Sparkles className="h-5 w-5 ml-2 text-purple-500" />
        </h2>
      </motion.div>

      {/* Feedback Cards Carousel */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            patient: "Priya Sharma",
            rating: 5,
            comment: "Doctor explained everything very clearly in simple terms.",
            date: "2024-01-15",
          },
          {
            patient: "Raj Kumar",
            rating: 4,
            comment: "Good consultation, felt comfortable discussing my concerns.",
            date: "2024-01-14",
          },
          {
            patient: "Anita Devi",
            rating: 5,
            comment: "Very patient and understanding. Answered all my questions.",
            date: "2024-01-13",
          },
        ].map((feedback, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group"
          >
            <Card className="bg-white border-yellow-100 shadow-md hover:shadow-lg transition-all duration-300 group-hover:border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    {feedback.patient}
                  </h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 + i * 0.1 }}
                      >
                        <Star
                          className={`h-4 w-4 ${i < feedback.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3 flex items-start">
                  <MessageCircle className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />"{feedback.comment}"
                </p>
                <p className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {feedback.date}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Communication Clarity Score */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white border-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Communication Clarity Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  Ease of Understanding
                </span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-green-600"
                >
                  92%
                </motion.span>
              </div>
              <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 1, delay: 0.5 }}>
                <Progress value={92} className="h-3" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { value: "4.8", label: "Avg Rating", color: "green", icon: Star },
                  { value: "156", label: "Total Reviews", color: "blue", icon: Users },
                  { value: "98%", label: "Recommend", color: "purple", icon: Heart },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className={`text-center p-4 bg-${stat.color}-50 rounded-lg border border-${stat.color}-100`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className={`h-5 w-5 text-${stat.color}-500 mr-2`} />
                      <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                    </div>
                    <div className={`text-sm text-${stat.color}-700`}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderOutbreak = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <MapPin className="h-6 w-6 mr-2 text-red-500" />
          Disease Monitor & Outbreak Heatmap
          <Globe className="h-5 w-5 ml-2 text-blue-500" />
        </h2>
      </motion.div>

      {/* Map Placeholder */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 text-white shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-gradient-to-br from-blue-800 to-purple-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
              ></motion.div>
              <div className="text-center z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Globe className="h-16 w-16 mx-auto mb-4 text-blue-300" />
                </motion.div>
                <p className="text-blue-200 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Interactive Disease Heatmap
                </p>
                <p className="text-sm text-blue-300 mt-2 flex items-center justify-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Showing outbreak hotspots in your region
                </p>
              </div>

              {/* Hotspot indicators */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5, delay: 0.5 }}
                className="absolute top-1/2 right-1/4 w-3 h-3 bg-yellow-500 rounded-full"
              ></motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 1 }}
                className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-orange-500 rounded-full"
              ></motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reported Symptoms by Area */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white border-gray-100 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Recent Symptom Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { area: "Sector 7 Village", symptoms: "Fever, Cough", cases: 12, severity: "Medium", color: "yellow" },
                {
                  area: "Rural Clinic East",
                  symptoms: "Stomach Pain, Nausea",
                  cases: 8,
                  severity: "Low",
                  color: "green",
                },
                { area: "Community Center", symptoms: "Respiratory Issues", cases: 18, severity: "High", color: "red" },
              ].map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: index * 0.3 }}
                      className={`w-3 h-3 rounded-full ${
                        report.color === "red"
                          ? "bg-red-500"
                          : report.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    ></motion.div>
                    <div>
                      <h4 className="font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {report.area}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        {report.symptoms}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      {report.cases}
                    </div>
                    <div className="text-sm text-gray-500">cases</div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" variant="outline" className="mt-2 hover:bg-red-50">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Flag Alert
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderMessages = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <MessageSquare className="h-6 w-6 mr-2 text-blue-500" />
          Messaging System
          <Globe className="h-5 w-5 ml-2 text-green-500" />
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white border-gray-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {[
                  {
                    name: "Health Worker - Sector 7",
                    lastMessage: "Patient needs immediate attention",
                    time: "2m ago",
                    unread: 2,
                    icon: Shield,
                  },
                  {
                    name: "Priya Sharma",
                    lastMessage: "Thank you for the consultation",
                    time: "1h ago",
                    unread: 0,
                    icon: UserCheck,
                  },
                  {
                    name: "Village Clinic Group",
                    lastMessage: "New cases reported",
                    time: "3h ago",
                    unread: 5,
                    icon: Users,
                  },
                ].map((chat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                    className="p-4 cursor-pointer border-b border-gray-100 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm flex items-center">
                          <chat.icon className="h-4 w-4 mr-2 text-blue-500" />
                          {chat.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {chat.lastMessage}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {chat.time}
                        </p>
                        {chat.unread > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1">
                            <Badge variant="destructive" className="text-xs">
                              {chat.unread}
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Window */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-white border-gray-100 shadow-lg h-[500px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                Health Worker - Sector 7
                <Badge variant="outline" className="ml-2 text-xs">
                  Online
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                    <p className="text-sm flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                      We have a patient with severe chest pain. Can you take a video call?
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      10:30 AM
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-end"
                >
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                    <p className="text-sm flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Yes, I'm available now. Please start the video call.
                    </p>
                    <p className="text-xs text-blue-200 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      10:32 AM
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                    <p className="text-sm flex items-center">
                      <Video className="h-3 w-3 mr-1 text-green-500" />
                      Starting video call now...
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      10:33 AM
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-50 border-gray-200 focus:border-blue-300"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" variant="outline" className="hover:bg-green-50">
                    <Mic className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard()
      case "appointments":
        return renderAppointments()
      case "consultation":
        return renderConsultation()
      case "records":
        return renderRecords()
      case "prescription":
        return renderPrescription()
      case "feedback":
        return renderFeedback()
      case "outbreak":
        return renderOutbreak()
      case "messages":
        return renderMessages()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg"
                >
                  <Stethoscope className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TeleSeva
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Doctor Portal
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Availability Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={isOnline ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setIsOnline(!isOnline)
                    setAvailabilityStatus(isOnline ? 'offline' : 'available')
                  }}
                  className={`${
                    isOnline
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  } transition-all duration-300`}
                >
                  {isOnline ? (
                    <>
                      <Wifi className="h-4 w-4 mr-2" />
                      Online
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-4 w-4 mr-2" />
                      Offline
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Status Indicator */}
              {isOnline && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    availabilityStatus === 'available' ? 'bg-green-500' :
                    availabilityStatus === 'busy' ? 'bg-yellow-500' :
                    availabilityStatus === 'in-consultation' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-xs text-gray-600 capitalize">{availabilityStatus}</span>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center">
                      3
                    </Badge>
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Avatar className="ring-2 ring-blue-100">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">DR</AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-md border-r border-gray-100 transition-transform duration-300 ease-in-out shadow-lg md:shadow-none`}
        >
          <nav className="p-4 space-y-2 mt-4">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveSection(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div layoutId="activeIndicator" className="ml-auto">
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            ))}
          </nav>
        </motion.aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50/30">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
