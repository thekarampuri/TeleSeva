// Firebase Firestore Data Models for TeleSeva

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'patient' | 'doctor';
  phoneNumber?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfile extends UserProfile {
  role: 'patient';
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  allergies?: string[];
  medicalHistory?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface DoctorProfile extends UserProfile {
  role: 'doctor';
  specialization: string;
  qualification: string[];
  experience: number; // years
  licenseNumber: string;
  consultationFee: number;
  languages: string[];
  availability: {
    isOnline: boolean;
    lastSeen: Date;
    workingHours: {
      [key: string]: { // day of week (monday, tuesday, etc.)
        start: string; // "09:00"
        end: string;   // "17:00"
        isAvailable: boolean;
      };
    };
  };
  rating: {
    average: number;
    totalReviews: number;
  };
  hospital?: {
    name: string;
    address: string;
    phone: string;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientDetails: {
    name: string;
    email: string;
    phone?: string;
    age?: number;
    gender?: string;
  };
  doctorDetails: {
    name: string;
    specialization: string;
    consultationFee: number;
  };
  appointmentDate: Date;
  appointmentTime: string; // "14:30"
  duration: number; // minutes
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'video' | 'audio' | 'chat';
  symptoms?: string;
  notes?: string;
  prescription?: {
    medicines: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    advice?: string;
    followUpDate?: Date;
  };
  payment: {
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paymentMethod?: string;
  };
  meetingDetails?: {
    roomId: string;
    joinUrl: string;
    startTime?: Date;
    endTime?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorAvailability {
  doctorId: string;
  isOnline: boolean;
  status: 'available' | 'busy' | 'in-consultation' | 'offline';
  lastSeen: Date;
  currentPatients: number;
  maxPatients: number;
  nextAvailableSlot?: Date;
}

export interface ConsultationSlot {
  id: string;
  doctorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  appointmentId?: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment_booked' | 'appointment_confirmed' | 'appointment_reminder' | 'appointment_cancelled' | 'payment_received' | 'review_received';
  title: string;
  message: string;
  data?: any; // additional data specific to notification type
  isRead: boolean;
  createdAt: Date;
}

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  APPOINTMENTS: 'appointments',
  DOCTOR_AVAILABILITY: 'doctor_availability',
  CONSULTATION_SLOTS: 'consultation_slots',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
} as const;

// Firestore Subcollections
export const SUBCOLLECTIONS = {
  APPOINTMENTS: 'appointments',
  NOTIFICATIONS: 'notifications',
  REVIEWS: 'reviews',
} as const;
