import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
  CollectionReference,
  Query,
  WhereFilterOp,
  OrderByDirection,
} from 'firebase/firestore';
import { db } from './firebase';

// Types for better TypeScript support
export interface FirestoreDocument {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  [key: string]: any;
}

export interface QueryOptions {
  orderBy?: { field: string; direction?: OrderByDirection };
  limit?: number;
  startAfter?: QueryDocumentSnapshot<DocumentData>;
  where?: { field: string; operator: WhereFilterOp; value: any }[];
}

// Collection references
export const collections = {
  users: 'users',
  consultations: 'consultations',
  appointments: 'appointments',
  healthRecords: 'healthRecords',
  medications: 'medications',
  symptoms: 'symptoms',
  facilities: 'facilities',
  notifications: 'notifications',
  reports: 'reports',
  emergencyContacts: 'emergencyContacts',
} as const;

// Generic CRUD operations
export class FirestoreService {
  /**
   * Add a new document to a collection
   */
  static async addDocument<T extends Record<string, any>>(
    collectionName: string,
    data: T
  ): Promise<DocumentReference> {
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    return await addDoc(collection(db, collectionName), docData);
  }

  /**
   * Get a single document by ID
   */
  static async getDocument<T extends FirestoreDocument>(
    collectionName: string,
    docId: string
  ): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  /**
   * Update a document
   */
  static async updateDocument<T extends Record<string, any>>(
    collectionName: string,
    docId: string,
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(docRef, updateData);
  }

  /**
   * Delete a document
   */
  static async deleteDocument(
    collectionName: string,
    docId: string
  ): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  }

  /**
   * Get multiple documents with optional filtering and pagination
   */
  static async getDocuments<T extends FirestoreDocument>(
    collectionName: string,
    options?: QueryOptions
  ): Promise<T[]> {
    let q: Query = collection(db, collectionName);

    // Apply where clauses
    if (options?.where) {
      options.where.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });
    }

    // Apply ordering
    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
    }

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    // Apply pagination
    if (options?.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  /**
   * Subscribe to real-time updates for a document
   */
  static subscribeToDocument<T extends FirestoreDocument>(
    collectionName: string,
    docId: string,
    callback: (data: T | null) => void
  ): () => void {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as T);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Subscribe to real-time updates for a collection
   */
  static subscribeToCollection<T extends FirestoreDocument>(
    collectionName: string,
    callback: (data: T[]) => void,
    options?: QueryOptions
  ): () => void {
    let q: Query = collection(db, collectionName);

    // Apply query options (same as getDocuments)
    if (options?.where) {
      options.where.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });
    }

    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
    }

    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    return onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      callback(documents);
    });
  }
}

// Specific service functions for common operations
export const userService = {
  async createUser(userData: any) {
    return FirestoreService.addDocument(collections.users, userData);
  },
  
  async getUser(userId: string) {
    return FirestoreService.getDocument(collections.users, userId);
  },
  
  async updateUser(userId: string, userData: any) {
    return FirestoreService.updateDocument(collections.users, userId, userData);
  },
};

export const consultationService = {
  async createConsultation(consultationData: any) {
    return FirestoreService.addDocument(collections.consultations, consultationData);
  },
  
  async getConsultation(consultationId: string) {
    return FirestoreService.getDocument(collections.consultations, consultationId);
  },
  
  async getUserConsultations(userId: string) {
    return FirestoreService.getDocuments(collections.consultations, {
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
  },
};

export const appointmentService = {
  async createAppointment(appointmentData: any) {
    return FirestoreService.addDocument(collections.appointments, appointmentData);
  },
  
  async getAppointment(appointmentId: string) {
    return FirestoreService.getDocument(collections.appointments, appointmentId);
  },
  
  async getUserAppointments(userId: string) {
    return FirestoreService.getDocuments(collections.appointments, {
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: { field: 'scheduledAt', direction: 'asc' },
    });
  },
};

// Export commonly used Firestore functions for direct use
export {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
