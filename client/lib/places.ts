import { Location, calculateDistance } from './location'

export interface Facility {
  id: string
  name: string
  type: 'hospital' | 'clinic' | 'pharmacy'
  address: string
  location: Location
  distance: number
  rating?: number
  reviews?: number
  phone?: string
  website?: string
  openNow?: boolean
  photos?: string[]
  services?: string[]
}

export interface PlacesResponse {
  facilities: Facility[]
  status: string
  error?: string
}

// For demo purposes, we'll use a mock service that simulates Google Places API
// In production, you would use the actual Google Places API
export const searchNearbyFacilities = async (
  userLocation: Location,
  radius: number = 5000, // 5km radius
  type?: 'hospital' | 'clinic' | 'pharmacy'
): Promise<PlacesResponse> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock data that simulates real facilities
    const mockFacilities: Omit<Facility, 'distance'>[] = [
      {
        id: '1',
        name: 'Apollo Hospital',
        type: 'hospital',
        address: 'Jubilee Hills, Hyderabad, Telangana 500033',
        location: { latitude: userLocation.latitude + 0.01, longitude: userLocation.longitude + 0.01 },
        rating: 4.5,
        reviews: 2847,
        phone: '+91-40-2360-7777',
        website: 'https://www.apollohospitals.com',
        openNow: true,
        services: ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Neurology']
      },
      {
        id: '2',
        name: 'CARE Hospital',
        type: 'hospital',
        address: 'Banjara Hills, Hyderabad, Telangana 500034',
        location: { latitude: userLocation.latitude - 0.015, longitude: userLocation.longitude + 0.008 },
        rating: 4.3,
        reviews: 1923,
        phone: '+91-40-6165-6565',
        website: 'https://www.carehospitals.com',
        openNow: true,
        services: ['Emergency', 'ICU', 'Oncology', 'Orthopedics']
      },
      {
        id: '3',
        name: 'Yashoda Hospital',
        type: 'hospital',
        address: 'Somajiguda, Hyderabad, Telangana 500082',
        location: { latitude: userLocation.latitude + 0.008, longitude: userLocation.longitude - 0.012 },
        rating: 4.4,
        reviews: 1654,
        phone: '+91-40-2344-4444',
        openNow: true,
        services: ['Emergency', 'Maternity', 'Pediatrics', 'Gastroenterology']
      },
      {
        id: '4',
        name: 'MedPlus Pharmacy',
        type: 'pharmacy',
        address: 'Ameerpet, Hyderabad, Telangana 500016',
        location: { latitude: userLocation.latitude + 0.005, longitude: userLocation.longitude + 0.003 },
        rating: 4.2,
        reviews: 456,
        phone: '+91-40-2374-5678',
        openNow: true,
        services: ['Prescription', 'OTC', 'Home Delivery', 'Health Checkup']
      },
      {
        id: '5',
        name: 'Apollo Pharmacy',
        type: 'pharmacy',
        address: 'Begumpet, Hyderabad, Telangana 500016',
        location: { latitude: userLocation.latitude - 0.003, longitude: userLocation.longitude + 0.007 },
        rating: 4.1,
        reviews: 623,
        phone: '+91-40-2340-1234',
        openNow: true,
        services: ['Prescription', 'OTC', '24/7 Service', 'Online Orders']
      },
      {
        id: '6',
        name: 'HealthCare Clinic',
        type: 'clinic',
        address: 'Kondapur, Hyderabad, Telangana 500084',
        location: { latitude: userLocation.latitude + 0.012, longitude: userLocation.longitude - 0.005 },
        rating: 4.0,
        reviews: 234,
        phone: '+91-40-2311-9876',
        openNow: false,
        services: ['General Medicine', 'Diagnostics', 'Vaccination']
      },
      {
        id: '7',
        name: 'Max Cure Hospital',
        type: 'hospital',
        address: 'Madhapur, Hyderabad, Telangana 500081',
        location: { latitude: userLocation.latitude - 0.008, longitude: userLocation.longitude - 0.010 },
        rating: 4.6,
        reviews: 1876,
        phone: '+91-40-6719-1000',
        openNow: true,
        services: ['Emergency', 'ICU', 'Transplant', 'Robotic Surgery']
      },
      {
        id: '8',
        name: 'Wellness Clinic',
        type: 'clinic',
        address: 'Gachibowli, Hyderabad, Telangana 500032',
        location: { latitude: userLocation.latitude + 0.006, longitude: userLocation.longitude + 0.009 },
        rating: 3.9,
        reviews: 187,
        phone: '+91-40-2300-5555',
        openNow: true,
        services: ['General Medicine', 'Dermatology', 'Physiotherapy']
      },
      {
        id: '9',
        name: 'Guardian Pharmacy',
        type: 'pharmacy',
        address: 'Kukatpally, Hyderabad, Telangana 500072',
        location: { latitude: userLocation.latitude - 0.007, longitude: userLocation.longitude - 0.004 },
        rating: 4.3,
        reviews: 345,
        phone: '+91-40-2318-7890',
        openNow: true,
        services: ['Prescription', 'Health Products', 'Consultation']
      },
      {
        id: '10',
        name: 'Continental Hospital',
        type: 'hospital',
        address: 'Gachibowli, Hyderabad, Telangana 500032',
        location: { latitude: userLocation.latitude + 0.014, longitude: userLocation.longitude + 0.006 },
        rating: 4.7,
        reviews: 2156,
        phone: '+91-40-6719-1000',
        openNow: true,
        services: ['Emergency', 'Heart Institute', 'Cancer Care', 'Neurosciences']
      }
    ]

    // Filter by type if specified
    let filteredFacilities = type 
      ? mockFacilities.filter(facility => facility.type === type)
      : mockFacilities

    // Calculate distances and add to facilities
    const facilitiesWithDistance: Facility[] = filteredFacilities.map(facility => ({
      ...facility,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        facility.location.latitude,
        facility.location.longitude
      )
    }))

    // Filter by radius and sort by distance
    const nearbyFacilities = facilitiesWithDistance
      .filter(facility => facility.distance <= radius / 1000) // Convert meters to km
      .sort((a, b) => a.distance - b.distance)

    return {
      facilities: nearbyFacilities,
      status: 'OK'
    }
  } catch (error) {
    return {
      facilities: [],
      status: 'ERROR',
      error: 'Failed to fetch nearby facilities'
    }
  }
}

// Function to get directions URL (opens in Google Maps)
export const getDirectionsUrl = (destination: Location, destinationName: string): string => {
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&destination_place_id=${encodeURIComponent(destinationName)}`
}
