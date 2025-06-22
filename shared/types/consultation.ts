export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  type: ConsultationType;
  status: ConsultationStatus;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  symptoms: string[];
  description: string;
  diagnosis?: string;
  prescription?: Prescription;
  notes?: string;
  rating?: number;
  review?: string;
  fee: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export type ConsultationType = 'video' | 'audio' | 'chat';

export type ConsultationStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Prescription {
  id: string;
  consultationId: string;
  medications: Medication[];
  instructions: string;
  validUntil: string;
  createdAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface ConsultationRequest {
  doctorId: string;
  type: ConsultationType;
  scheduledAt: string;
  symptoms: string[];
  description: string;
  urgency: 'low' | 'medium' | 'high';
}
