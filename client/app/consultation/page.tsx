"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainLayout } from "@/components/layout/main-layout"
import { Video, Mic, MessageCircle, Star, Clock, Users, Shuffle, UserPlus, Calendar, Wifi, AlertCircle } from "lucide-react"
import { doctorAvailabilityService } from "@/lib/firebase/doctor-availability"
import { consultationBookingService } from "@/lib/firebase/consultation-booking"
import { DoctorProfile } from "@/lib/firebase/types"
import { useAuth } from "@/lib/firebase/auth.tsx"

const consultationModes = [
  { id: "video", label: "Video Call", icon: Video, price: "₹299" },
  { id: "audio", label: "Audio Call", icon: Mic, price: "₹199" },
  { id: "chat", label: "Chat", icon: MessageCircle, price: "₹99" },
]

function ConsultationPageContent() {
  const [selectedMode, setSelectedMode] = useState<"video" | "audio" | "chat">("video")
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [availableDoctors, setAvailableDoctors] = useState<DoctorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState(false)
  const { user } = useAuth()

  // Load available doctors
  useEffect(() => {
    const unsubscribe = doctorAvailabilityService.subscribeToAvailableDoctors((doctors) => {
      setAvailableDoctors(doctors)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Handle booking consultation
  const handleBookConsultation = async () => {
    if (!selectedDoctor || !user) {
      setError('Please select a doctor and ensure you are logged in')
      return
    }

    setBooking(true)
    setError(null)

    try {
      const appointmentDate = new Date()
      appointmentDate.setHours(appointmentDate.getHours() + 1) // Book for 1 hour from now

      const appointmentId = await consultationBookingService.bookConsultation({
        doctorId: selectedDoctor,
        patientId: user.uid,
        appointmentDate,
        appointmentTime: appointmentDate.toTimeString().slice(0, 5),
        type: selectedMode,
        symptoms: '', // Could be collected from a form
        notes: `Consultation booked via ${selectedMode} mode`,
      })

      alert(`Consultation booked successfully! Appointment ID: ${appointmentId}`)
      setSelectedDoctor(null)
    } catch (error) {
      console.error('Error booking consultation:', error)
      setError(error instanceof Error ? error.message : 'Failed to book consultation')
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
                    disabled={booking || !user}
                  >
                    {booking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Booking...
                      </>
                    ) : !user ? (
                      'Login Required'
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
