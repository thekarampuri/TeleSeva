"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainLayout } from "@/components/layout/main-layout"
import { Video, Mic, MessageCircle, Star, Clock, Users, Shuffle, UserPlus, Calendar } from "lucide-react"

const consultationModes = [
  { id: "video", label: "Video Call", icon: Video, price: "₹299" },
  { id: "audio", label: "Audio Call", icon: Mic, price: "₹199" },
  { id: "chat", label: "Chat", icon: MessageCircle, price: "₹99" },
]

const doctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    specialty: "General Medicine",
    rating: 4.9,
    experience: "12 years",
    simplicity: 5,
    available: true,
    nextSlot: "2:30 PM",
    image: "/placeholder.svg?height=100&width=100",
    languages: ["Hindi", "English"],
    consultations: 1250,
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    rating: 4.8,
    experience: "15 years",
    simplicity: 4,
    available: true,
    nextSlot: "3:00 PM",
    image: "/placeholder.svg?height=100&width=100",
    languages: ["Hindi", "English", "Bengali"],
    consultations: 980,
  },
  {
    id: 3,
    name: "Dr. Anita Patel",
    specialty: "Pediatrics",
    rating: 4.9,
    experience: "10 years",
    simplicity: 5,
    available: false,
    nextSlot: "5:00 PM",
    image: "/placeholder.svg?height=100&width=100",
    languages: ["Hindi", "English", "Gujarati"],
    consultations: 750,
  },
]

export default function ConsultationPage() {
  const [selectedMode, setSelectedMode] = useState("video")
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)

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
              <CardTitle>Available Doctors</CardTitle>
              <CardDescription>Choose a doctor based on specialty and simplicity rating</CardDescription>
            </div>
            <Button variant="outline" className="flex items-center">
              <Shuffle className="h-4 w-4 mr-2" />
              Instant Swap
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDoctor === doctor.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                          {doctor.available && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">Available Now</Badge>
                          )}
                        </div>

                        <p className="text-gray-600 mb-2">{doctor.specialty}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {doctor.rating}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {doctor.experience}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {doctor.consultations} consultations
                          </div>
                        </div>

                        <div className="mt-3 flex items-center space-x-4">
                          <div>
                            <span className="text-sm text-gray-500">Simplicity Rating:</span>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < doctor.simplicity ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-gray-500">Languages:</span>
                            <div className="flex space-x-1 mt-1">
                              {doctor.languages.map((lang) => (
                                <Badge key={lang} variant="outline" className="text-xs">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Next available</p>
                      <p className="font-semibold text-blue-600">{doctor.nextSlot}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

        {/* Book Consultation */}
        {selectedDoctor && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Ready to Consult?</h3>
                  <p className="text-blue-100">
                    {consultationModes.find((m) => m.id === selectedMode)?.label} with{" "}
                    {doctors.find((d) => d.id === selectedDoctor)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{consultationModes.find((m) => m.id === selectedMode)?.price}</p>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 mt-2">
                    Start Consultation
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
