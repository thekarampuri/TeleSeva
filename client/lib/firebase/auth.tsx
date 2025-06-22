import { useState, useEffect, createContext, useContext } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile, COLLECTIONS } from './types';
import { doctorAvailabilityService } from './doctor-availability';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Load user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            const userProfile = {
              ...profileData,
              createdAt: profileData.createdAt?.toDate() || new Date(),
              updatedAt: profileData.updatedAt?.toDate() || new Date(),
            } as UserProfile;

            setUserProfile(userProfile);

            // If user is a doctor, automatically set them as online
            if (userProfile.role === 'doctor') {
              try {
                await doctorAvailabilityService.setDoctorOnlineStatus(user.uid, true, 'available');
                console.log('Doctor set as online:', user.uid);

                // Set up event listeners to handle browser close/refresh
                const handleBeforeUnload = async () => {
                  await doctorAvailabilityService.setDoctorOnlineStatus(user.uid, false, 'offline');
                };

                const handleVisibilityChange = async () => {
                  if (document.hidden) {
                    // Tab is hidden, set doctor as away
                    await doctorAvailabilityService.updateDoctorStatus(user.uid, 'busy');
                  } else {
                    // Tab is visible again, set doctor as available
                    await doctorAvailabilityService.updateDoctorStatus(user.uid, 'available');
                  }
                };

                window.addEventListener('beforeunload', handleBeforeUnload);
                document.addEventListener('visibilitychange', handleVisibilityChange);

                // Cleanup function
                return () => {
                  window.removeEventListener('beforeunload', handleBeforeUnload);
                  document.removeEventListener('visibilitychange', handleVisibilityChange);
                };
              } catch (error) {
                console.error('Error setting doctor online status:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, role: 'patient' | 'doctor') => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(user, { displayName });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userProfile);
      
      // Also create role-specific profile
      if (role === 'patient') {
        await setDoc(doc(db, COLLECTIONS.PATIENTS, user.uid), {
          ...userProfile,
          role: 'patient',
        });
      } else if (role === 'doctor') {
        // Create doctor profile with default values
        const doctorProfile = {
          ...userProfile,
          role: 'doctor',
          specialization: 'General Medicine',
          qualification: ['MBBS'],
          experience: 1,
          licenseNumber: '',
          consultationFee: 500,
          languages: ['English'],
          availability: {
            isOnline: false,
            lastSeen: new Date(),
            workingHours: {},
          },
          rating: {
            average: 0,
            totalReviews: 0,
          },
        };

        await setDoc(doc(db, COLLECTIONS.DOCTORS, user.uid), doctorProfile);

        // Initialize doctor availability record
        await doctorAvailabilityService.setDoctorOnlineStatus(user.uid, false, 'offline');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // If user is a doctor, set them as offline before logging out
      if (user && userProfile?.role === 'doctor') {
        try {
          await doctorAvailabilityService.setDoctorOnlineStatus(user.uid, false, 'offline');
          console.log('Doctor set as offline:', user.uid);
        } catch (error) {
          console.error('Error setting doctor offline status:', error);
        }
      }

      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for components that need auth state
export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
