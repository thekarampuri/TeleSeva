import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { COLLECTIONS } from '@/lib/firebase/types'
import { doctorAvailabilityService } from '@/lib/firebase/doctor-availability'

// Sample doctor data for testing
const sampleDoctors = [
  {
    uid: 'doctor-1-test',
    email: 'dr.sharma@teleseva.com',
    displayName: 'Dr. Rajesh Sharma',
    role: 'doctor' as const,
    specialization: 'Cardiology',
    qualification: ['MBBS', 'MD Cardiology'],
    experience: 15,
    licenseNumber: 'MH12345',
    consultationFee: 800,
    languages: ['English', 'Hindi', 'Marathi'],
    availability: {
      isOnline: true,
      lastSeen: new Date(),
      workingHours: {
        monday: { start: '09:00', end: '17:00', isAvailable: true },
        tuesday: { start: '09:00', end: '17:00', isAvailable: true },
        wednesday: { start: '09:00', end: '17:00', isAvailable: true },
        thursday: { start: '09:00', end: '17:00', isAvailable: true },
        friday: { start: '09:00', end: '17:00', isAvailable: true },
        saturday: { start: '09:00', end: '13:00', isAvailable: true },
        sunday: { start: '10:00', end: '12:00', isAvailable: false },
      },
    },
    rating: {
      average: 4.8,
      totalReviews: 156,
    },
    hospital: {
      name: 'Apollo Hospital',
      address: 'Mumbai, Maharashtra',
      phone: '+91-9876543210',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    uid: 'doctor-2-test',
    email: 'dr.patel@teleseva.com',
    displayName: 'Dr. Priya Patel',
    role: 'doctor' as const,
    specialization: 'Pediatrics',
    qualification: ['MBBS', 'MD Pediatrics'],
    experience: 8,
    licenseNumber: 'GJ67890',
    consultationFee: 600,
    languages: ['English', 'Hindi', 'Gujarati'],
    availability: {
      isOnline: true,
      lastSeen: new Date(),
      workingHours: {
        monday: { start: '10:00', end: '18:00', isAvailable: true },
        tuesday: { start: '10:00', end: '18:00', isAvailable: true },
        wednesday: { start: '10:00', end: '18:00', isAvailable: true },
        thursday: { start: '10:00', end: '18:00', isAvailable: true },
        friday: { start: '10:00', end: '18:00', isAvailable: true },
        saturday: { start: '10:00', end: '14:00', isAvailable: true },
        sunday: { start: '10:00', end: '12:00', isAvailable: false },
      },
    },
    rating: {
      average: 4.6,
      totalReviews: 89,
    },
    hospital: {
      name: 'Fortis Hospital',
      address: 'Ahmedabad, Gujarat',
      phone: '+91-9876543211',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    uid: 'doctor-3-test',
    email: 'dr.kumar@teleseva.com',
    displayName: 'Dr. Amit Kumar',
    role: 'doctor' as const,
    specialization: 'General Medicine',
    qualification: ['MBBS', 'MD Internal Medicine'],
    experience: 12,
    licenseNumber: 'DL11223',
    consultationFee: 500,
    languages: ['English', 'Hindi'],
    availability: {
      isOnline: true,
      lastSeen: new Date(),
      workingHours: {
        monday: { start: '08:00', end: '16:00', isAvailable: true },
        tuesday: { start: '08:00', end: '16:00', isAvailable: true },
        wednesday: { start: '08:00', end: '16:00', isAvailable: true },
        thursday: { start: '08:00', end: '16:00', isAvailable: true },
        friday: { start: '08:00', end: '16:00', isAvailable: true },
        saturday: { start: '08:00', end: '12:00', isAvailable: true },
        sunday: { start: '10:00', end: '12:00', isAvailable: false },
      },
    },
    rating: {
      average: 4.5,
      totalReviews: 234,
    },
    hospital: {
      name: 'AIIMS',
      address: 'New Delhi',
      phone: '+91-9876543212',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export class DoctorSeeder {
  /**
   * Seed sample doctors for testing
   */
  static async seedSampleDoctors(): Promise<void> {
    try {
      console.log('Seeding sample doctors...')
      
      for (const doctor of sampleDoctors) {
        // Create doctor profile
        await setDoc(doc(db, COLLECTIONS.DOCTORS, doctor.uid), doctor)
        
        // Create user profile
        await setDoc(doc(db, COLLECTIONS.USERS, doctor.uid), {
          uid: doctor.uid,
          email: doctor.email,
          displayName: doctor.displayName,
          role: doctor.role,
          createdAt: doctor.createdAt,
          updatedAt: doctor.updatedAt,
        })
        
        // Set doctor as online
        await doctorAvailabilityService.setDoctorOnlineStatus(doctor.uid, true, 'available')
        
        console.log(`Seeded doctor: ${doctor.displayName}`)
      }
      
      console.log('Sample doctors seeded successfully!')
    } catch (error) {
      console.error('Error seeding sample doctors:', error)
      throw error
    }
  }
  
  /**
   * Remove sample doctors
   */
  static async removeSampleDoctors(): Promise<void> {
    try {
      console.log('Removing sample doctors...')
      
      for (const doctor of sampleDoctors) {
        // Set doctor as offline first
        await doctorAvailabilityService.setDoctorOnlineStatus(doctor.uid, false, 'offline')
        console.log(`Removed doctor: ${doctor.displayName}`)
      }
      
      console.log('Sample doctors removed successfully!')
    } catch (error) {
      console.error('Error removing sample doctors:', error)
      throw error
    }
  }
  
  /**
   * Get sample doctor UIDs
   */
  static getSampleDoctorUIDs(): string[] {
    return sampleDoctors.map(doctor => doctor.uid)
  }
}
