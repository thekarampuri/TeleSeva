"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  MapPin, 
  Clock, 
  Ambulance,
  Heart,
  AlertTriangle,
  Shield,
  Users,
  Navigation
} from "lucide-react"

const emergencyContacts = [
  { name: "Ambulance", number: "108", description: "Medical Emergency", icon: Ambulance },
  { name: "Police", number: "100", description: "Security Emergency", icon: Shield },
  { name: "Fire Brigade", number: "101", description: "Fire Emergency", icon: AlertTriangle },
  { name: "Women Helpline", number: "1091", description: "Women Safety", icon: Users }
]

const nearbyHospitals = [
  {
    name: "City General Hospital",
    distance: "0.8 km",
    time: "3 min",
    rating: 4.5,
    emergency: true,
    phone: "+91-9876543210"
  },
  {
    name: "Apollo Medical Center",
    distance: "1.2 km", 
    time: "5 min",
    rating: 4.8,
    emergency: true,
    phone: "+91-9876543211"
  },
  {
    name: "Max Healthcare",
    distance: "2.1 km",
    time: "8 min", 
    rating: 4.6,
    emergency: true,
    phone: "+91-9876543212"
  }
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

export default function EmergencyPage() {
  return (
    <MainLayout>
      <motion.div 
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Services</h1>
          <p className="text-gray-600">Quick access to emergency contacts and nearby medical facilities</p>
        </motion.div>

        {/* SOS Button */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-2" />
              <span className="text-lg font-bold">SOS</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-red-500" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <motion.div
                    key={contact.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <contact.icon className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.description}</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => window.open(`tel:${contact.number}`)}
                    >
                      {contact.number}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Nearby Hospitals */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Nearby Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearbyHospitals.map((hospital, index) => (
                <motion.div
                  key={hospital.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Navigation className="h-4 w-4 mr-1" />
                          {hospital.distance}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {hospital.time}
                        </div>
                        <Badge variant="secondary">
                          ⭐ {hospital.rating}
                        </Badge>
                        {hospital.emergency && (
                          <Badge className="bg-green-600">
                            24/7 Emergency
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`tel:${hospital.phone}`)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Tips */}
        <motion.div variants={itemVariants}>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-yellow-800">
                <li>• Stay calm and assess the situation</li>
                <li>• Call the appropriate emergency number</li>
                <li>• Provide clear location information</li>
                <li>• Follow dispatcher instructions</li>
                <li>• Keep emergency contacts readily available</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
