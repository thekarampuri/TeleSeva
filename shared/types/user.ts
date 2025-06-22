export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  emergencyContacts?: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
}

export type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'facility_admin' | 'responder' | 'admin';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string[];
  licenseNumber: string;
  experience: number;
  qualifications: string[];
  consultationFee: number;
  availability: DoctorAvailability[];
  rating: number;
  totalConsultations: number;
  languages: string[];
  isVerified: boolean;
}

export interface DoctorAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface Patient extends User {
  role: 'patient';
  medicalHistory?: MedicalHistory;
  allergies?: string[];
  currentMedications?: string[];
  bloodType?: string;
  height?: number; // in cm
  weight?: number; // in kg
}

export interface MedicalHistory {
  conditions: string[];
  surgeries: string[];
  familyHistory: string[];
  notes?: string;
}
