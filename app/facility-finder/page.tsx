"use client"

import { useState, useEffect } from "react"
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
  Zap,
  Loader2,
  AlertCircle,
  ExternalLink
} from "lucide-react"
import { getCurrentLocation, Location } from "@/lib/location"
import { searchNearbyFacilities, Facility, getDirectionsUrl } from "@/lib/places"
import { toast } from "sonner"

export default function FacilityFinderPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [selectedType, setSelectedType] = useState<'hospital' | 'clinic' | 'pharmacy' | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const facilityTypes = [
    {
      name: "All",
      value: "all" as const,
      icon: MapPin,
      count: facilities.length
    },
    {
      name: "Hospitals",
      value: "hospital" as const,
      icon: Heart,
      count: facilities.filter(f => f.type === 'hospital').length
    },
    {
      name: "Clinics",
      value: "clinic" as const,
      icon: Stethoscope,
      count: facilities.filter(f => f.type === 'clinic').length
    },
    {
      name: "Pharmacies",
      value: "pharmacy" as const,
      icon: Pill,
      count: facilities.filter(f => f.type === 'pharmacy').length
    }
  ]

  const getUserLocation = async () => {
    setLocationLoading(true)
    try {
      const location = await getCurrentLocation()
      setUserLocation(location)
      toast.success('Location detected successfully!')
      await fetchNearbyFacilities(location)
    } catch (error: any) {
      toast.error(error.message || 'Failed to get location')
    } finally {
      setLocationLoading(false)
    }
  }

  const fetchNearbyFacilities = async (location: Location, type?: 'hospital' | 'clinic' | 'pharmacy') => {
    setLoading(true)
    try {
      const response = await searchNearbyFacilities(location, 10000, type) // 10km radius
      if (response.status === 'OK') {
        setFacilities(response.facilities)
        toast.success(`Found ${response.facilities.length} nearby facilities`)
      } else {
        toast.error(response.error || 'Failed to fetch facilities')
      }
    } catch (error) {
      toast.error('Failed to fetch nearby facilities')
    } finally {
      setLoading(false)
    }
  }

  const handleTypeFilter = async (type: typeof selectedType) => {
    setSelectedType(type)
    if (userLocation) {
      await fetchNearbyFacilities(userLocation, type === 'all' ? undefined : type)
    }
  }

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDirections = (facility: Facility) => {
    const url = getDirectionsUrl(facility.location, facility.name)
    window.open(url, '_blank')
  }

  useEffect(() => {
    // Auto-detect location on page load
    getUserLocation()
  }, [])

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
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [selectedType, setSelectedType] = useState<'hospital' | 'clinic' | 'pharmacy' | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const facilityTypes = [
    {
      name: "All",
      value: "all" as const,
      icon: MapPin,
      count: facilities.length
    },
    {
      name: "Hospitals",
      value: "hospital" as const,
      icon: Heart,
      count: facilities.filter(f => f.type === 'hospital').length
    },
    {
      name: "Clinics",
      value: "clinic" as const,
      icon: Stethoscope,
      count: facilities.filter(f => f.type === 'clinic').length
    },
    {
      name: "Pharmacies",
      value: "pharmacy" as const,
      icon: Pill,
      count: facilities.filter(f => f.type === 'pharmacy').length
    }
  ]

  const getUserLocation = async () => {
    setLocationLoading(true)
    try {
      const location = await getCurrentLocation()
      setUserLocation(location)
      toast.success('Location detected successfully!')
      await fetchNearbyFacilities(location)
    } catch (error: any) {
      toast.error(error.message || 'Failed to get location')
    } finally {
      setLocationLoading(false)
    }
  }

  const fetchNearbyFacilities = async (location: Location, type?: 'hospital' | 'clinic' | 'pharmacy') => {
    setLoading(true)
    try {
      const response = await searchNearbyFacilities(location, 10000, type) // 10km radius
      if (response.status === 'OK') {
        setFacilities(response.facilities)
        toast.success(`Found ${response.facilities.length} nearby facilities`)
      } else {
        toast.error(response.error || 'Failed to fetch facilities')
      }
    } catch (error) {
      toast.error('Failed to fetch nearby facilities')
    } finally {
      setLoading(false)
    }
  }

  const handleTypeFilter = async (type: typeof selectedType) => {
    setSelectedType(type)
    if (userLocation) {
      await fetchNearbyFacilities(userLocation, type === 'all' ? undefined : type)
    }
  }

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDirections = (facility: Facility) => {
    const url = getDirectionsUrl(facility.location, facility.name)
    window.open(url, '_blank')
  }

  useEffect(() => {
    // Auto-detect location on page load
    getUserLocation()
  }, [])

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
            <p className="text-gray-600 mt-1">
              {userLocation
                ? `Found ${facilities.length} facilities near you`
                : "Find nearby hospitals, clinics, and pharmacies"
              }
            </p>
          </div>
          <Button
            onClick={getUserLocation}
            disabled={locationLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {locationLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            {locationLoading ? 'Detecting...' : 'Use My Location'}
          </Button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for hospitals, clinics, or pharmacies..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => userLocation && fetchNearbyFacilities(userLocation)}
            disabled={!userLocation || loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Filter className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </motion.div>

        {/* Facility Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {facilityTypes.map((type, index) => (
            <motion.div key={type.name} variants={itemVariants}>
              <Card
                className={`cursor-pointer hover:shadow-md transition-all duration-300 ${
                  selectedType === type.value
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleTypeFilter(type.value)}
              >
                <CardContent className="p-4 text-center">
                  <type.icon className={`h-8 w-8 mx-auto mb-2 ${
                    selectedType === type.value ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <h3 className={`font-semibold ${
                    selectedType === type.value ? 'text-blue-900' : 'text-gray-900'
                  }`}>{type.name}</h3>
                  <p className={`text-sm ${
                    selectedType === type.value ? 'text-blue-700' : 'text-gray-600'
                  }`}>{type.count} nearby</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Facilities List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Nearby Facilities</CardTitle>
                {loading && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading facilities...
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!userLocation ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Location Required</h3>
                  <p className="text-gray-600 mb-4">
                    Please allow location access to find nearby healthcare facilities
                  </p>
                  <Button onClick={getUserLocation} disabled={locationLoading}>
                    {locationLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4 mr-2" />
                    )}
                    Enable Location
                  </Button>
                </div>
              ) : filteredFacilities.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Facilities Found</h3>
                  <p className="text-gray-600">
                    {searchQuery
                      ? "No facilities match your search criteria"
                      : "No healthcare facilities found in your area"
                    }
                  </p>
                </div>
              ) : (
                filteredFacilities.map((facility, index) => (
                  <motion.div
                    key={facility.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        {facility.type === 'hospital' ? <Heart className="h-6 w-6 text-blue-600" /> :
                         facility.type === 'pharmacy' ? <Pill className="h-6 w-6 text-blue-600" /> :
                         <Stethoscope className="h-6 w-6 text-blue-600" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            Verified
                          </Badge>
                          {facility.openNow && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Open Now
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm text-gray-600 capitalize">{facility.type}</span>
                          {facility.rating && (
                            <>
                              <span className="text-sm text-gray-600">•</span>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-sm font-medium">{facility.rating}</span>
                                {facility.reviews && (
                                  <span className="text-sm text-gray-500 ml-1">({facility.reviews})</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{facility.address}</p>

                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Navigation className="h-4 w-4 mr-1" />
                            {facility.distance} km away
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            ~{Math.round(facility.distance * 3)} min drive
                          </div>
                        </div>

                        {facility.services && facility.services.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {facility.services.slice(0, 4).map((service, serviceIndex) => (
                              <Badge key={serviceIndex} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {facility.services.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{facility.services.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {facility.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${facility.phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleDirections(facility)}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                      {facility.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(facility.website, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Website
                        </Button>
                      )}
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
