"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Star,
  Search,
  Filter,
  Heart,
  Stethoscope,
  Pill,
  Eye,
  Zap
} from "lucide-react"

const facilities = [
  {
    id: 1,
    name: "City General Hospital",
    type: "Hospital",
    specialty: "Multi-specialty",
    distance: "0.8 km",
    time: "3 min drive",
    rating: 4.5,
    reviews: 1247,
    phone: "+91-9876543210",
    address: "123 Main Street, City Center",
    services: ["Emergency", "ICU", "Surgery", "Cardiology"],
    open24: true,
    verified: true
  },
  {
    id: 2,
    name: "Apollo Medical Center",
    type: "Hospital",
    specialty: "Cardiology",
    distance: "1.2 km",
    time: "5 min drive",
    rating: 4.8,
    reviews: 892,
    phone: "+91-9876543211",
    address: "456 Health Avenue, Medical District",
    services: ["Heart Care", "Diagnostics", "Emergency"],
    open24: true,
    verified: true
  },
  {
    id: 3,
    name: "HealthCare Plus Clinic",
    type: "Clinic",
    specialty: "General Medicine",
    distance: "0.5 km",
    time: "2 min walk",
    rating: 4.3,
    reviews: 324,
    phone: "+91-9876543212",
    address: "789 Wellness Road, Downtown",
    services: ["Consultation", "Diagnostics", "Pharmacy"],
    open24: false,
    verified: true
  },
  {
    id: 4,
    name: "MedLife Pharmacy",
    type: "Pharmacy",
    specialty: "Medicine Store",
    distance: "0.3 km",
    time: "1 min walk",
    rating: 4.6,
    reviews: 156,
    phone: "+91-9876543213",
    address: "321 Medicine Lane, Local Market",
    services: ["Prescription", "OTC", "Home Delivery"],
    open24: true,
    verified: true
  },
  {
    id: 5,
    name: "Vision Eye Care",
    type: "Specialty Clinic",
    specialty: "Ophthalmology",
    distance: "2.1 km",
    time: "8 min drive",
    rating: 4.7,
    reviews: 445,
    phone: "+91-9876543214",
    address: "654 Eye Care Center, Medical Plaza",
    services: ["Eye Exam", "Surgery", "Laser Treatment"],
    open24: false,
    verified: true
  }
]

const facilityTypes = [
  { name: "All", icon: MapPin, count: facilities.length },
  { name: "Hospitals", icon: Heart, count: facilities.filter(f => f.type === 'Hospital').length },
  { name: "Clinics", icon: Stethoscope, count: facilities.filter(f => f.type === 'Clinic' || f.type === 'Specialty Clinic').length },
  { name: "Pharmacies", icon: Pill, count: facilities.filter(f => f.type === 'Pharmacy').length }
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

export default function FacilityFinderPage() {
  return (
    <MainLayout>
      <motion.div 
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Facility Finder</h1>
            <p className="text-gray-600 mt-1">Find nearby hospitals, clinics, and pharmacies</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <MapPin className="h-4 w-4 mr-2" />
            Use My Location
          </Button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search for hospitals, clinics, or pharmacies..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </motion.div>

        {/* Facility Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {facilityTypes.map((type, index) => (
            <motion.div key={type.name} variants={itemVariants}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <type.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.count} nearby</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Facilities List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Nearby Facilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {facilities.map((facility, index) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      {facility.type === 'Hospital' ? <Heart className="h-6 w-6 text-blue-600" /> :
                       facility.type === 'Pharmacy' ? <Pill className="h-6 w-6 text-blue-600" /> :
                       <Stethoscope className="h-6 w-6 text-blue-600" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                        {facility.verified && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            Verified
                          </Badge>
                        )}
                        {facility.open24 && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            24/7
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-sm text-gray-600">{facility.type}</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{facility.specialty}</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{facility.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({facility.reviews})</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{facility.address}</p>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Navigation className="h-4 w-4 mr-1" />
                          {facility.distance}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {facility.time}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {facility.services.map((service, serviceIndex) => (
                          <Badge key={serviceIndex} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`tel:${facility.phone}`)}
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

        {/* Emergency Notice */}
        <motion.div variants={itemVariants}>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-800">Emergency?</h3>
                  <p className="text-sm text-red-700">
                    For medical emergencies, call 108 immediately or visit the nearest emergency room.
                  </p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 ml-auto">
                  Emergency
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
