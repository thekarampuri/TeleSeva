import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Appointment, PatientProfile, DoctorProfile, Notification, COLLECTIONS, SUBCOLLECTIONS } from './types';
import { doctorAvailabilityService } from './doctor-availability';

export interface BookingRequest {
  doctorId: string;
  patientId: string;
  appointmentDate: Date;
  appointmentTime: string;
  type: 'video' | 'audio' | 'chat';
  symptoms?: string;
  notes?: string;
}

export class ConsultationBookingService {
  /**
   * Book a new consultation appointment
   */
  async bookConsultation(bookingRequest: BookingRequest): Promise<string> {
    try {
      // Check if doctor is available
      const isAvailable = await doctorAvailabilityService.isDoctorAvailableForBooking(bookingRequest.doctorId);
      if (!isAvailable) {
        throw new Error('Doctor is not available for booking at this time');
      }

      // Get patient and doctor details
      const [patientDoc, doctorDoc] = await Promise.all([
        getDoc(doc(db, COLLECTIONS.PATIENTS, bookingRequest.patientId)),
        getDoc(doc(db, COLLECTIONS.DOCTORS, bookingRequest.doctorId))
      ]);

      if (!patientDoc.exists() || !doctorDoc.exists()) {
        throw new Error('Patient or doctor not found');
      }

      const patientData = patientDoc.data() as PatientProfile;
      const doctorData = doctorDoc.data() as DoctorProfile;

      // Create appointment object
      const appointment: Omit<Appointment, 'id'> = {
        patientId: bookingRequest.patientId,
        doctorId: bookingRequest.doctorId,
        patientDetails: {
          name: patientData.displayName,
          email: patientData.email,
          phone: patientData.phoneNumber,
          age: patientData.dateOfBirth ? 
            new Date().getFullYear() - patientData.dateOfBirth.getFullYear() : undefined,
          gender: patientData.gender,
        },
        doctorDetails: {
          name: doctorData.displayName,
          specialization: doctorData.specialization,
          consultationFee: doctorData.consultationFee,
        },
        appointmentDate: bookingRequest.appointmentDate,
        appointmentTime: bookingRequest.appointmentTime,
        duration: 30, // default 30 minutes
        status: 'pending',
        type: bookingRequest.type,
        symptoms: bookingRequest.symptoms,
        notes: bookingRequest.notes,
        payment: {
          amount: doctorData.consultationFee,
          status: 'pending',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save appointment to Firestore
      const appointmentRef = await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), {
        ...appointment,
        appointmentDate: Timestamp.fromDate(appointment.appointmentDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update doctor's patient count
      await doctorAvailabilityService.incrementPatientCount(bookingRequest.doctorId);

      // Create notifications for both patient and doctor
      await Promise.all([
        this.createNotification(bookingRequest.patientId, {
          type: 'appointment_booked',
          title: 'Appointment Booked',
          message: `Your appointment with Dr. ${doctorData.displayName} has been booked for ${bookingRequest.appointmentDate.toDateString()} at ${bookingRequest.appointmentTime}`,
          data: { appointmentId: appointmentRef.id },
        }),
        this.createNotification(bookingRequest.doctorId, {
          type: 'appointment_booked',
          title: 'New Appointment',
          message: `New appointment booked by ${patientData.displayName} for ${bookingRequest.appointmentDate.toDateString()} at ${bookingRequest.appointmentTime}`,
          data: { appointmentId: appointmentRef.id },
        })
      ]);

      return appointmentRef.id;
    } catch (error) {
      console.error('Error booking consultation:', error);
      throw error;
    }
  }

  /**
   * Get appointments for a patient
   */
  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    try {
      const appointmentsQuery = query(
        collection(db, COLLECTIONS.APPOINTMENTS),
        where('patientId', '==', patientId),
        orderBy('appointmentDate', 'desc')
      );

      const snapshot = await getDocs(appointmentsQuery);
      const appointments: Appointment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          ...data,
          id: doc.id,
          appointmentDate: data.appointmentDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          prescription: data.prescription ? {
            ...data.prescription,
            followUpDate: data.prescription.followUpDate?.toDate(),
          } : undefined,
          meetingDetails: data.meetingDetails ? {
            ...data.meetingDetails,
            startTime: data.meetingDetails.startTime?.toDate(),
            endTime: data.meetingDetails.endTime?.toDate(),
          } : undefined,
        } as Appointment);
      });

      return appointments;
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      throw error;
    }
  }

  /**
   * Get appointments for a doctor
   */
  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    try {
      const appointmentsQuery = query(
        collection(db, COLLECTIONS.APPOINTMENTS),
        where('doctorId', '==', doctorId),
        orderBy('appointmentDate', 'desc')
      );

      const snapshot = await getDocs(appointmentsQuery);
      const appointments: Appointment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          ...data,
          id: doc.id,
          appointmentDate: data.appointmentDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          prescription: data.prescription ? {
            ...data.prescription,
            followUpDate: data.prescription.followUpDate?.toDate(),
          } : undefined,
          meetingDetails: data.meetingDetails ? {
            ...data.meetingDetails,
            startTime: data.meetingDetails.startTime?.toDate(),
            endTime: data.meetingDetails.endTime?.toDate(),
          } : undefined,
        } as Appointment);
      });

      return appointments;
    } catch (error) {
      console.error('Error getting doctor appointments:', error);
      throw error;
    }
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(
    appointmentId: string, 
    status: Appointment['status'],
    updatedBy: string
  ): Promise<void> {
    try {
      const appointmentRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
      
      await updateDoc(appointmentRef, {
        status,
        updatedAt: serverTimestamp(),
      });

      // Get appointment details for notification
      const appointmentDoc = await getDoc(appointmentRef);
      if (appointmentDoc.exists()) {
        const appointment = appointmentDoc.data() as Appointment;
        
        // Create notification for the other party
        const notificationUserId = updatedBy === appointment.patientId ? 
          appointment.doctorId : appointment.patientId;
        
        const isPatientUpdate = updatedBy === appointment.patientId;
        
        await this.createNotification(notificationUserId, {
          type: 'appointment_confirmed',
          title: `Appointment ${status}`,
          message: `Your appointment has been ${status} by ${isPatientUpdate ? 'patient' : 'doctor'}`,
          data: { appointmentId },
        });
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(appointmentId: string, cancelledBy: string, reason?: string): Promise<void> {
    try {
      const appointmentRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
      const appointmentDoc = await getDoc(appointmentRef);
      
      if (!appointmentDoc.exists()) {
        throw new Error('Appointment not found');
      }

      const appointment = appointmentDoc.data() as Appointment;
      
      await updateDoc(appointmentRef, {
        status: 'cancelled',
        notes: reason ? `${appointment.notes || ''}\nCancellation reason: ${reason}` : appointment.notes,
        updatedAt: serverTimestamp(),
      });

      // Decrement doctor's patient count
      await doctorAvailabilityService.decrementPatientCount(appointment.doctorId);

      // Create notifications
      const otherUserId = cancelledBy === appointment.patientId ? 
        appointment.doctorId : appointment.patientId;
      
      await this.createNotification(otherUserId, {
        type: 'appointment_cancelled',
        title: 'Appointment Cancelled',
        message: `Your appointment has been cancelled${reason ? `: ${reason}` : ''}`,
        data: { appointmentId },
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  /**
   * Subscribe to patient appointments
   */
  subscribeToPatientAppointments(
    patientId: string,
    callback: (appointments: Appointment[]) => void
  ): () => void {
    const appointmentsQuery = query(
      collection(db, COLLECTIONS.APPOINTMENTS),
      where('patientId', '==', patientId),
      orderBy('appointmentDate', 'desc')
    );

    return onSnapshot(appointmentsQuery, (snapshot) => {
      const appointments: Appointment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          ...data,
          id: doc.id,
          appointmentDate: data.appointmentDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Appointment);
      });

      callback(appointments);
    });
  }

  /**
   * Subscribe to doctor appointments
   */
  subscribeToDoctorAppointments(
    doctorId: string,
    callback: (appointments: Appointment[]) => void
  ): () => void {
    const appointmentsQuery = query(
      collection(db, COLLECTIONS.APPOINTMENTS),
      where('doctorId', '==', doctorId),
      orderBy('appointmentDate', 'desc')
    );

    return onSnapshot(appointmentsQuery, (snapshot) => {
      const appointments: Appointment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          ...data,
          id: doc.id,
          appointmentDate: data.appointmentDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Appointment);
      });

      callback(appointments);
    });
  }

  /**
   * Create notification
   */
  private async createNotification(
    userId: string, 
    notification: Omit<Notification, 'id' | 'userId' | 'isRead' | 'createdAt'>
  ): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
        ...notification,
        userId,
        isRead: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }
}

// Export singleton instance
export const consultationBookingService = new ConsultationBookingService();
