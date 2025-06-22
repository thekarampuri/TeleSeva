import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc
} from 'firebase/firestore';

// Collection names
const DOCTORS_COLLECTION = 'doctors';
const PATIENTS_COLLECTION = 'patients';

/**
 * Remove a user from a specific role collection
 * @param userId The Firebase Auth user ID
 * @param role The role to remove ('doctor' or 'patient')
 */
async function removeUserFromRole(userId: string, role: 'doctor' | 'patient') {
  try {
    const collectionName = role === 'doctor' ? DOCTORS_COLLECTION : PATIENTS_COLLECTION;
    const userRef = doc(db, collectionName, userId);
    
    // Check if the document exists before deleting
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      await deleteDoc(userRef);
      console.log(`User ${userId} removed from ${collectionName} collection`);
    }
  } catch (error) {
    console.error(`Error removing user from ${role} collection:`, error);
  }
}

/**
 * Save a user's role in Firestore
 * @param userId The Firebase Auth user ID
 * @param role The user's role ('doctor' or 'patient')
 * @param userData Additional user data to store
 */
export async function saveUserRole(
  userId: string, 
  role: 'doctor' | 'patient', 
  userData: Record<string, any> = {}
) {
  try {
    // First, determine the opposite role
    const oppositeRole = role === 'doctor' ? 'patient' : 'doctor';
    
    // Remove the user from the opposite role collection to ensure they're only in one collection
    await removeUserFromRole(userId, oppositeRole);
    
    // Now save to the correct collection
    const collectionName = role === 'doctor' ? DOCTORS_COLLECTION : PATIENTS_COLLECTION;
    
    // Create a reference to the user document
    const userRef = doc(db, collectionName, userId);
    
    // Merge the userId with any additional data
    const dataToSave = {
      userId,
      role, // Explicitly store the role in the document
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Save to Firestore
    await setDoc(userRef, dataToSave);
    
    console.log(`User ${userId} saved to ${collectionName} collection with role ${role}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error saving user role:', error);
    throw error;
  }
}

/**
 * Check if a user exists in a specific role collection
 * @param userId The Firebase Auth user ID
 * @param role The role to check ('doctor' or 'patient')
 * @returns Boolean indicating if the user has the specified role
 */
export async function checkUserRole(userId: string, role: 'doctor' | 'patient'): Promise<boolean> {
  try {
    const collectionName = role === 'doctor' ? DOCTORS_COLLECTION : PATIENTS_COLLECTION;
    
    console.log(`Checking if user ${userId} exists in ${collectionName} collection`);
    
    // Create a reference to the user document
    const userRef = doc(db, collectionName, userId);
    
    // Get the document
    const userDoc = await getDoc(userRef);
    
    const exists = userDoc.exists();
    console.log(`User ${userId} ${exists ? 'exists' : 'does not exist'} in ${collectionName} collection`);
    
    // Return true if the document exists
    return exists;
  } catch (error) {
    console.error(`Error checking if user ${userId} exists in ${role} collection:`, error);
    return false;
  }
}

/**
 * Get a user's role from Firestore
 * @param userId The Firebase Auth user ID
 * @returns The user's role ('doctor', 'patient', or null if not found)
 */
export async function getUserRole(userId: string): Promise<'doctor' | 'patient' | null> {
  try {
    console.log(`Checking role for user: ${userId}`);
    
    // Check if user is a doctor
    const isDoctor = await checkUserRole(userId, 'doctor');
    console.log(`User ${userId} is doctor: ${isDoctor}`);
    if (isDoctor) return 'doctor';
    
    // Check if user is a patient
    const isPatient = await checkUserRole(userId, 'patient');
    console.log(`User ${userId} is patient: ${isPatient}`);
    if (isPatient) return 'patient';
    
    // User not found in either collection
    console.log(`User ${userId} not found in any role collection`);
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Get user data from Firestore based on their role
 * @param userId The Firebase Auth user ID
 * @param role The user's role ('doctor' or 'patient')
 * @returns The user data or null if not found
 */
export async function getUserData(
  userId: string, 
  role: 'doctor' | 'patient'
): Promise<Record<string, any> | null> {
  try {
    const collectionName = role === 'doctor' ? DOCTORS_COLLECTION : PATIENTS_COLLECTION;
    
    // Create a reference to the user document
    const userRef = doc(db, collectionName, userId);
    
    // Get the document
    const userDoc = await getDoc(userRef);
    
    // Return the data if the document exists
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}