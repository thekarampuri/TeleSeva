/**
 * Firebase Firestore Usage Examples
 * 
 * This file contains examples of how to use the Firestore service
 * for common operations in the TeleSeva application.
 */

import { 
  FirestoreService, 
  userService, 
  consultationService, 
  appointmentService,
  collections 
} from './firestore';

// Example: User Management
export const userExamples = {
  // Create a new user profile
  async createUserProfile(userId: string, userData: any) {
    try {
      const userProfile = {
        uid: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        address: userData.address,
        emergencyContact: userData.emergencyContact,
        medicalHistory: [],
        allergies: [],
        currentMedications: [],
      };
      
      const docRef = await userService.createUser(userProfile);
      console.log('User profile created with ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const user = await userService.getUser(userId);
      return user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: any) {
    try {
      await userService.updateUser(userId, updates);
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

// Example: Consultation Management
export const consultationExamples = {
  // Create a new consultation
  async createConsultation(consultationData: any) {
    try {
      const consultation = {
        userId: consultationData.userId,
        doctorId: consultationData.doctorId,
        type: consultationData.type, // 'video', 'audio', 'chat'
        status: 'scheduled', // 'scheduled', 'in-progress', 'completed', 'cancelled'
        scheduledAt: consultationData.scheduledAt,
        symptoms: consultationData.symptoms,
        notes: consultationData.notes || '',
        prescription: null,
        followUpRequired: false,
      };
      
      const docRef = await consultationService.createConsultation(consultation);
      console.log('Consultation created with ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }
  },

  // Get user's consultation history
  async getUserConsultations(userId: string) {
    try {
      const consultations = await consultationService.getUserConsultations(userId);
      return consultations;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  },

  // Update consultation status
  async updateConsultationStatus(consultationId: string, status: string, notes?: string) {
    try {
      const updates: any = { status };
      if (notes) updates.notes = notes;
      if (status === 'completed') updates.completedAt = new Date();
      
      await FirestoreService.updateDocument(collections.consultations, consultationId, updates);
      console.log('Consultation status updated');
    } catch (error) {
      console.error('Error updating consultation:', error);
      throw error;
    }
  },
};

// Example: Appointment Management
export const appointmentExamples = {
  // Schedule a new appointment
  async scheduleAppointment(appointmentData: any) {
    try {
      const appointment = {
        userId: appointmentData.userId,
        doctorId: appointmentData.doctorId,
        facilityId: appointmentData.facilityId,
        type: appointmentData.type, // 'consultation', 'checkup', 'follow-up'
        scheduledAt: appointmentData.scheduledAt,
        duration: appointmentData.duration || 30, // minutes
        status: 'scheduled',
        reason: appointmentData.reason,
        notes: appointmentData.notes || '',
      };
      
      const docRef = await appointmentService.createAppointment(appointment);
      console.log('Appointment scheduled with ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  },

  // Get user's upcoming appointments
  async getUpcomingAppointments(userId: string) {
    try {
      const appointments = await FirestoreService.getDocuments(collections.appointments, {
        where: [
          { field: 'userId', operator: '==', value: userId },
          { field: 'status', operator: '==', value: 'scheduled' },
          { field: 'scheduledAt', operator: '>=', value: new Date() }
        ],
        orderBy: { field: 'scheduledAt', direction: 'asc' },
        limit: 10,
      });
      return appointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },
};

// Example: Real-time subscriptions
export const realtimeExamples = {
  // Subscribe to user profile changes
  subscribeToUserProfile(userId: string, callback: (user: any) => void) {
    return FirestoreService.subscribeToDocument(
      collections.users,
      userId,
      callback
    );
  },

  // Subscribe to user's notifications
  subscribeToNotifications(userId: string, callback: (notifications: any[]) => void) {
    return FirestoreService.subscribeToCollection(
      collections.notifications,
      callback,
      {
        where: [
          { field: 'userId', operator: '==', value: userId },
          { field: 'read', operator: '==', value: false }
        ],
        orderBy: { field: 'createdAt', direction: 'desc' },
        limit: 20,
      }
    );
  },
};

// Example: Health Records Management
export const healthRecordExamples = {
  // Add a new health record
  async addHealthRecord(userId: string, recordData: any) {
    try {
      const healthRecord = {
        userId,
        type: recordData.type, // 'lab-result', 'prescription', 'diagnosis', 'vital-signs'
        title: recordData.title,
        description: recordData.description,
        data: recordData.data, // specific data based on type
        attachments: recordData.attachments || [],
        doctorId: recordData.doctorId,
        facilityId: recordData.facilityId,
        recordDate: recordData.recordDate || new Date(),
      };
      
      const docRef = await FirestoreService.addDocument(collections.healthRecords, healthRecord);
      console.log('Health record added with ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error adding health record:', error);
      throw error;
    }
  },

  // Get user's health records
  async getUserHealthRecords(userId: string, type?: string) {
    try {
      const whereConditions = [{ field: 'userId', operator: '==', value: userId }];
      if (type) {
        whereConditions.push({ field: 'type', operator: '==', value: type });
      }
      
      const records = await FirestoreService.getDocuments(collections.healthRecords, {
        where: whereConditions,
        orderBy: { field: 'recordDate', direction: 'desc' },
      });
      return records;
    } catch (error) {
      console.error('Error fetching health records:', error);
      throw error;
    }
  },
};

// Example usage in a React component:
/*
import { userExamples, consultationExamples, realtimeExamples } from '@/lib/firestore-examples';

// In your component
const [user, setUser] = useState(null);
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  // Subscribe to real-time updates
  const unsubscribeUser = realtimeExamples.subscribeToUserProfile(userId, setUser);
  const unsubscribeNotifications = realtimeExamples.subscribeToNotifications(userId, setNotifications);
  
  // Cleanup subscriptions
  return () => {
    unsubscribeUser();
    unsubscribeNotifications();
  };
}, [userId]);

// Create consultation
const handleCreateConsultation = async (consultationData) => {
  try {
    await consultationExamples.createConsultation(consultationData);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
*/
