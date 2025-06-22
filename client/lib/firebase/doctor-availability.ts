import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { DoctorProfile, DoctorAvailability, COLLECTIONS } from './types';

export class DoctorAvailabilityService {
  /**
   * Set doctor online status
   */
  async setDoctorOnlineStatus(
    doctorId: string, 
    isOnline: boolean, 
    status: DoctorAvailability['status'] = 'available'
  ): Promise<void> {
    try {
      const availabilityRef = doc(db, COLLECTIONS.DOCTOR_AVAILABILITY, doctorId);
      
      await setDoc(availabilityRef, {
        doctorId,
        isOnline,
        status: isOnline ? status : 'offline',
        lastSeen: serverTimestamp(),
        currentPatients: 0,
        maxPatients: 5, // default max patients
      }, { merge: true });

      // Also update the doctor's profile
      const doctorRef = doc(db, COLLECTIONS.DOCTORS, doctorId);
      await updateDoc(doctorRef, {
        'availability.isOnline': isOnline,
        'availability.lastSeen': serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

    } catch (error) {
      console.error('Error setting doctor online status:', error);
      throw error;
    }
  }

  /**
   * Get all available doctors
   */
  async getAvailableDoctors(): Promise<DoctorProfile[]> {
    try {
      const doctorsQuery = query(
        collection(db, COLLECTIONS.DOCTORS),
        where('availability.isOnline', '==', true),
        orderBy('availability.lastSeen', 'desc')
      );

      const snapshot = await getDocs(doctorsQuery);
      const doctors: DoctorProfile[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        doctors.push({
          ...data,
          uid: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          availability: {
            ...data.availability,
            lastSeen: data.availability?.lastSeen?.toDate() || new Date(),
          }
        } as DoctorProfile);
      });

      return doctors;
    } catch (error) {
      console.error('Error getting available doctors:', error);
      throw error;
    }
  }

  /**
   * Get doctor availability status
   */
  async getDoctorAvailability(doctorId: string): Promise<DoctorAvailability | null> {
    try {
      const availabilityRef = doc(db, COLLECTIONS.DOCTOR_AVAILABILITY, doctorId);
      const snapshot = await getDoc(availabilityRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();
      return {
        ...data,
        lastSeen: data.lastSeen?.toDate() || new Date(),
      } as DoctorAvailability;
    } catch (error) {
      console.error('Error getting doctor availability:', error);
      throw error;
    }
  }

  /**
   * Update doctor status (available, busy, in-consultation)
   */
  async updateDoctorStatus(
    doctorId: string, 
    status: DoctorAvailability['status']
  ): Promise<void> {
    try {
      const availabilityRef = doc(db, COLLECTIONS.DOCTOR_AVAILABILITY, doctorId);
      
      await updateDoc(availabilityRef, {
        status,
        lastSeen: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating doctor status:', error);
      throw error;
    }
  }

  /**
   * Increment current patients count
   */
  async incrementPatientCount(doctorId: string): Promise<void> {
    try {
      const availability = await this.getDoctorAvailability(doctorId);
      if (!availability) return;

      const newCount = availability.currentPatients + 1;
      const newStatus = newCount >= availability.maxPatients ? 'busy' : 'available';

      const availabilityRef = doc(db, COLLECTIONS.DOCTOR_AVAILABILITY, doctorId);
      await updateDoc(availabilityRef, {
        currentPatients: newCount,
        status: newStatus,
        lastSeen: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error incrementing patient count:', error);
      throw error;
    }
  }

  /**
   * Decrement current patients count
   */
  async decrementPatientCount(doctorId: string): Promise<void> {
    try {
      const availability = await this.getDoctorAvailability(doctorId);
      if (!availability) return;

      const newCount = Math.max(0, availability.currentPatients - 1);
      const newStatus = availability.isOnline ? 'available' : 'offline';

      const availabilityRef = doc(db, COLLECTIONS.DOCTOR_AVAILABILITY, doctorId);
      await updateDoc(availabilityRef, {
        currentPatients: newCount,
        status: newStatus,
        lastSeen: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error decrementing patient count:', error);
      throw error;
    }
  }

  /**
   * Listen to available doctors in real-time
   */
  subscribeToAvailableDoctors(
    callback: (doctors: DoctorProfile[]) => void
  ): () => void {
    const doctorsQuery = query(
      collection(db, COLLECTIONS.DOCTORS),
      where('availability.isOnline', '==', true),
      orderBy('availability.lastSeen', 'desc')
    );

    return onSnapshot(doctorsQuery, (snapshot) => {
      const doctors: DoctorProfile[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        doctors.push({
          ...data,
          uid: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          availability: {
            ...data.availability,
            lastSeen: data.availability?.lastSeen?.toDate() || new Date(),
          }
        } as DoctorProfile);
      });

      callback(doctors);
    }, (error) => {
      console.error('Error in doctors subscription:', error);
    });
  }

  /**
   * Listen to doctor availability changes
   */
  subscribeToDoctorAvailability(
    doctorId: string,
    callback: (availability: DoctorAvailability | null) => void
  ): () => void {
    const availabilityRef = doc(db, COLLECTIONS.DOCTOR_AVAILABILITY, doctorId);

    return onSnapshot(availabilityRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      const data = snapshot.data();
      callback({
        ...data,
        lastSeen: data.lastSeen?.toDate() || new Date(),
      } as DoctorAvailability);
    }, (error) => {
      console.error('Error in availability subscription:', error);
    });
  }

  /**
   * Set doctor as offline (cleanup on logout)
   */
  async setDoctorOffline(doctorId: string): Promise<void> {
    await this.setDoctorOnlineStatus(doctorId, false, 'offline');
  }

  /**
   * Check if doctor is currently available for new appointments
   */
  async isDoctorAvailableForBooking(doctorId: string): Promise<boolean> {
    try {
      const availability = await this.getDoctorAvailability(doctorId);
      
      if (!availability) return false;
      
      return availability.isOnline && 
             availability.status === 'available' && 
             availability.currentPatients < availability.maxPatients;
    } catch (error) {
      console.error('Error checking doctor availability:', error);
      return false;
    }
  }
}

// Export singleton instance
export const doctorAvailabilityService = new DoctorAvailabilityService();
