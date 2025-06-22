"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainLayout } from "@/components/layout/main-layout"
import { Video, Mic, MessageCircle, Star, Clock, Users, Shuffle, UserPlus, Calendar, Wifi, AlertCircle } from "lucide-react"

import { DoctorProfile } from "@/lib/firebase/types"
import { useAuth } from "@/contexts/AuthContext"

const consultationModes = [
  { id: "video", label: "Video Call", icon: Video, price: "₹299" },
  { id: "audio", label: "Audio Call", icon: Mic, price: "₹199" },
  { id: "chat", label: "Chat", icon: MessageCircle, price: "₹99" },
]

// Mock data for Indian doctors
const mockDoctors: DoctorProfile[] = [
  {
    uid: "doctor-1",
    email: "dr.sharma@teleseva.com",
    displayName: "Dr. Rajesh Sharma",
    role: "doctor",
    phoneNumber: "+91-9876543210",
    profilePicture: "/placeholder.svg",
    createdAt: new Date(),
    updatedAt: new Date(),
    specialization: "Cardiology",
    qualification: ["MBBS", "MD Cardiology", "DM Interventional Cardiology"],
    experience: 15,
    licenseNumber: "MH12345",
    consultationFee: 800,
    languages: ["English", "Hindi", "Marathi"],
    availability: {
      isOnline: true,
      lastSeen: new Date(),
      workingHours: {
        monday: { start: "09:00", end: "17:00", isAvailable: true },
        tuesday: { start: "09:00", end: "17:00", isAvailable: true },
        wednesday: { start: "09:00", end: "17:00", isAvailable: true },
        thursday: { start: "09:00", end: "17:00", isAvailable: true },
        friday: { start: "09:00", end: "17:00", isAvailable: true },
      },
    },
    rating: {
      average: 4.8,
      totalReviews: 156,
    },
    hospital: {
      name: "Apollo Hospital Mumbai",
      address: "Sahar Road, Andheri East, Mumbai",
      phone: "+91-22-6767-4444",
    },
  },
  {
    uid: "doctor-2",
    email: "dr.priya@teleseva.com",
    displayName: "Dr. Priya Patel",
    role: "doctor",
    phoneNumber: "+91-9876543211",
    profilePicture: "/placeholder.svg",
    createdAt: new Date(),
    updatedAt: new Date(),
    specialization: "Pediatrics",
    qualification: ["MBBS", "MD Pediatrics"],
    experience: 12,
    licenseNumber: "GJ67890",
    consultationFee: 600,
    languages: ["English", "Hindi", "Gujarati"],
    availability: {
      isOnline: true,
      lastSeen: new Date(),
      workingHours: {
        monday: { start: "10:00", end: "18:00", isAvailable: true },
        tuesday: { start: "10:00", end: "18:00", isAvailable: true },
        wednesday: { start: "10:00", end: "18:00", isAvailable: true },
        thursday: { start: "10:00", end: "18:00", isAvailable: true },
        friday: { start: "10:00", end: "18:00", isAvailable: true },
      },
    },
    rating: {
      average: 4.9,
      totalReviews: 203,
    },
    hospital: {
      name: "Fortis Hospital Ahmedabad",
      address: "Vasna-Bhayli Road, Vadodara",
      phone: "+91-265-6681-800",
    },
  },
  {
    uid: "doctor-3",
    email: "dr.kumar@teleseva.com",
    displayName: "Dr. Anil Kumar",
    role: "doctor",
    phoneNumber: "+91-9876543212",
    profilePicture: "/placeholder.svg",
    createdAt: new Date(),
    updatedAt: new Date(),
    specialization: "General Medicine",
    qualification: ["MBBS", "MD Internal Medicine"],
    experience: 8,
    licenseNumber: "DL11223",
    consultationFee: 500,
    languages: ["English", "Hindi", "Punjabi"],
    availability: {
      isOnline: true,
      lastSeen: new Date(),
      workingHours: {
        monday: { start: "08:00", end: "16:00", isAvailable: true },
        tuesday: { start: "08:00", end: "16:00", isAvailable: true },
        wednesday: { start: "08:00", end: "16:00", isAvailable: true },
        thursday: { start: "08:00", end: "16:00", isAvailable: true },
        friday: { start: "08:00", end: "16:00", isAvailable: true },
      },
    },
    rating: {
      average: 4.6,
      totalReviews: 89,
    },
    hospital: {
      name: "Max Super Speciality Hospital Delhi",
      address: "Press Enclave Road, Saket, New Delhi",
      phone: "+91-11-2651-5050",
    },
  },
  {
    uid: "doctor-4",
    email: "dr.meera@teleseva.com",
    displayName: "Dr. Meera Reddy",
    role: "doctor",
    phoneNumber: "+91-9876543213",
    profilePicture: "/placeholder.svg",
    createdAt: new Date(),
    updatedAt: new Date(),
    specialization: "Dermatology",
    qualification: ["MBBS", "MD Dermatology", "Fellowship in Cosmetic Dermatology"],
    experience: 10,
    licenseNumber: "AP33445",
    consultationFee: 700,
    languages: ["English", "Hindi", "Telugu", "Tamil"],
    availability: {
      isOnline: true,
      lastSeen: new Date(),
      workingHours: {
        monday: { start: "11:00", end: "19:00", isAvailable: true },
        tuesday: { start: "11:00", end: "19:00", isAvailable: true },
        wednesday: { start: "11:00", end: "19:00", isAvailable: true },
        thursday: { start: "11:00", end: "19:00", isAvailable: true },
        friday: { start: "11:00", end: "19:00", isAvailable: true },
      },
    },
    rating: {
      average: 4.7,
      totalReviews: 134,
    },
    hospital: {
      name: "KIMS Hospital Hyderabad",
      address: "Minister Road, Secunderabad",
      phone: "+91-40-4488-5555",
    },
  },
  {
    uid: "doctor-5",
    email: "dr.singh@teleseva.com",
    displayName: "Dr. Vikram Singh",
    role: "doctor",
    phoneNumber: "+91-9876543214",
    profilePicture: "/placeholder.svg",
    createdAt: new Date(),
    updatedAt: new Date(),
    specialization: "Orthopedics",
    qualification: ["MBBS", "MS Orthopedics", "Fellowship in Joint Replacement"],
    experience: 18,
    licenseNumber: "RJ55667",
    consultationFee: 900,
    languages: ["English", "Hindi", "Rajasthani"],
    availability: {
      isOnline: true,
      lastSeen: new Date(),
      workingHours: {
        monday: { start: "09:00", end: "17:00", isAvailable: true },
        tuesday: { start: "09:00", end: "17:00", isAvailable: true },
        wednesday: { start: "09:00", end: "17:00", isAvailable: true },
        thursday: { start: "09:00", end: "17:00", isAvailable: true },
        friday: { start: "09:00", end: "17:00", isAvailable: true },
      },
    },
    rating: {
      average: 4.9,
      totalReviews: 278,
    },
    hospital: {
      name: "Fortis Escorts Hospital Jaipur",
      address: "Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur",
      phone: "+91-141-254-7000",
    },
  },
  {
    uid: "doctor-6",
    email: "dr.nair@teleseva.com",
    displayName: "Dr. Lakshmi Nair",
    role: "doctor",
    phoneNumber: "+91-9876543215",
    profilePicture: "/placeholder.svg",
    createdAt: new Date(),
    updatedAt: new Date(),
    specialization: "Gynecology",
    qualification: ["MBBS", "MD Obstetrics & Gynecology", "Fellowship in Laparoscopy"],
    experience: 14,
    licenseNumber: "KL77889",
    consultationFee: 750,
    languages: ["English", "Hindi", "Malayalam", "Tamil"],
    availability: {
      isOnline: true,
      lastSeen: new Date(),
      workingHours: {
        monday: { start: "10:00", end: "18:00", isAvailable: true },
        tuesday: { start: "10:00", end: "18:00", isAvailable: true },
        wednesday: { start: "10:00", end: "18:00", isAvailable: true },
        thursday: { start: "10:00", end: "18:00", isAvailable: true },
        friday: { start: "10:00", end: "18:00", isAvailable: true },
      },
    },
    rating: {
      average: 4.8,
      totalReviews: 192,
    },
    hospital: {
      name: "Aster Medcity Kochi",
      address: "Kuttisahib Road, Cheranelloor, Kochi",
      phone: "+91-484-6699-999",
    },
  },
]

function ConsultationPageContent() {
  const [selectedMode, setSelectedMode] = useState<"video" | "audio" | "chat">("video")
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [availableDoctors, setAvailableDoctors] = useState<DoctorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState(false)
  const { user } = useAuth()

  // Load available doctors (using mock data)
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setAvailableDoctors(mockDoctors)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handle booking consultation (mock implementation)
  const handleBookConsultation = async () => {
    if (!selectedDoctor) {
      setError('Please select a doctor')
      return
    }

    setBooking(true)
    setError(null)

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000))

      const selectedDoctorData = availableDoctors.find(d => d.uid === selectedDoctor)
      const appointmentId = `APPT-${Date.now()}`

      alert(`Consultation booked successfully!\n\nAppointment ID: ${appointmentId}\nDoctor: ${selectedDoctorData?.displayName}\nMode: ${selectedMode}\nFee: ₹${selectedDoctorData?.consultationFee}`)
      setSelectedDoctor(null)
    } catch (error) {
      console.error('Error booking consultation:', error)
      setError('Failed to book consultation. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Consultation</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with certified doctors instantly. Choose your preferred consultation mode and doctor.
          </p>
        </div>

        {/* Consultation Mode Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle>Choose Consultation Mode</CardTitle>
            <CardDescription>Select how you'd like to consult with the doctor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {consultationModes.map((mode) => (
                <div
                  key={mode.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMode === mode.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <mode.icon className={`h-6 w-6 ${selectedMode === mode.id ? "text-blue-600" : "text-gray-600"}`} />
                    <span className="font-bold text-green-600">{mode.price}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{mode.label}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Wifi className="h-5 w-5 mr-2 text-green-500" />
                Available Doctors ({availableDoctors.length})
              </CardTitle>
              <CardDescription>Choose from doctors who are currently online and available</CardDescription>
            </div>
            <Button variant="outline" className="flex items-center" onClick={() => window.location.reload()}>
              <Shuffle className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading available doctors...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8 text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            ) : availableDoctors.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No doctors are currently available</p>
                  <p className="text-sm">Please try again later or schedule an appointment</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {availableDoctors.map((doctor) => (
                <div
                  key={doctor.uid}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDoctor === doctor.uid
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedDoctor(doctor.uid)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={doctor.profilePicture || "/placeholder.svg"} alt={doctor.displayName} />
                        <AvatarFallback>
                          {doctor.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{doctor.displayName}</h3>
                          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                            Online
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-2">{doctor.specialization}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {doctor.rating.average.toFixed(1)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {doctor.experience} years
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {doctor.rating.totalReviews} reviews
                          </div>
                        </div>

                        <div className="mt-3 flex items-center space-x-4">
                          <div>
                            <span className="text-sm text-gray-500">Fee:</span>
                            <span className="ml-1 font-semibold text-green-600">₹{doctor.consultationFee}</span>
                          </div>

                          <div>
                            <span className="text-sm text-gray-500">Languages:</span>
                            <div className="flex space-x-1 mt-1">
                              {doctor.languages.slice(0, 3).map((lang) => (
                                <Badge key={lang} variant="outline" className="text-xs">
                                  {lang}
                                </Badge>
                              ))}
                              {doctor.languages.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{doctor.languages.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {doctor.hospital && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">Hospital:</span>
                            <span className="ml-1 text-sm text-gray-700">{doctor.hospital.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last seen</p>
                      <p className="font-semibold text-blue-600">
                        {new Date(doctor.availability.lastSeen).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                Health Buddy
              </CardTitle>
              <CardDescription>Invite a family member or friend to join the consultation</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Invite Health Buddy
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Schedule Later
              </CardTitle>
              <CardDescription>Book an appointment for a specific date and time</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Schedule Appointment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-50 border-red-200 border-0">
            <CardContent className="p-4">
              <div className="flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Book Consultation */}
        {selectedDoctor && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Ready to Consult?</h3>
                  <p className="text-blue-100">
                    {consultationModes.find((m) => m.id === selectedMode)?.label} with{" "}
                    {availableDoctors.find((d) => d.uid === selectedDoctor)?.displayName}
                  </p>
                  <p className="text-blue-200 text-sm mt-1">
                    Consultation will start immediately after booking
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₹{availableDoctors.find((d) => d.uid === selectedDoctor)?.consultationFee}
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 mt-2"
                    onClick={handleBookConsultation}
                    disabled={booking}
                  >
                    {booking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Booking...
                      </>
                    ) : (
                      'Book Consultation'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

export default function ConsultationPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <MainLayout>
        <div className="p-6 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Doctor Consultation</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Loading...
            </p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return <ConsultationPageContent />
}
