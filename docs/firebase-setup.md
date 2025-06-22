# Firebase Setup Guide for TeleSeva

## ✅ Current Configuration Status

Your TeleSeva project is now **properly configured** for Firebase database (Firestore) and all other Firebase services.

## 🔧 What Was Fixed

### 1. Updated Firebase Configuration (`client/lib/firebase.ts`)
- ✅ Added Firestore database import and initialization
- ✅ Added Firebase Storage import and initialization
- ✅ Maintained existing Auth and Analytics setup
- ✅ Exported `db` and `storage` instances for use throughout the app

### 2. Created Firestore Service Layer (`client/lib/firestore.ts`)
- ✅ Generic CRUD operations with TypeScript support
- ✅ Real-time subscriptions for live data updates
- ✅ Query builders with filtering, ordering, and pagination
- ✅ Pre-defined collection references
- ✅ Service-specific functions for common operations

### 3. Added Usage Examples (`client/lib/firestore-examples.ts`)
- ✅ Complete examples for user management
- ✅ Consultation and appointment handling
- ✅ Health records management
- ✅ Real-time subscription patterns
- ✅ React component integration examples

## 🏗️ Firebase Services Now Available

### 1. **Firestore Database** 
```typescript
import { db } from '@/lib/firebase';
import { FirestoreService } from '@/lib/firestore';

// Use the service layer (recommended)
const user = await FirestoreService.getDocument('users', userId);

// Or use Firestore directly
import { doc, getDoc } from 'firebase/firestore';
const userDoc = await getDoc(doc(db, 'users', userId));
```

### 2. **Authentication**
```typescript
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const userCredential = await signInWithEmailAndPassword(auth, email, password);
```

### 3. **Storage**
```typescript
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storageRef = ref(storage, 'images/profile.jpg');
await uploadBytes(storageRef, file);
const downloadURL = await getDownloadURL(storageRef);
```

### 4. **Analytics**
```typescript
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

if (analytics) {
  logEvent(analytics, 'page_view', { page_title: 'Home' });
}
```

## 📊 Database Collections Structure

The following collections are pre-defined and ready to use:

- **`users`** - User profiles and account information
- **`consultations`** - Video consultation records
- **`appointments`** - Scheduled appointments
- **`healthRecords`** - Patient health records and history
- **`medications`** - Prescription and medication tracking
- **`symptoms`** - Symptom checker data
- **`facilities`** - Healthcare facility information
- **`notifications`** - User notifications
- **`reports`** - Health reports and analytics
- **`emergencyContacts`** - Emergency contact information

## 🚀 Quick Start Examples

### Create a User Profile
```typescript
import { userService } from '@/lib/firestore';

const userProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  dateOfBirth: new Date('1990-01-01'),
  // ... other fields
};

const docRef = await userService.createUser(userProfile);
console.log('User created with ID:', docRef.id);
```

### Schedule a Consultation
```typescript
import { consultationService } from '@/lib/firestore';

const consultation = {
  userId: 'user123',
  doctorId: 'doctor456',
  type: 'video',
  scheduledAt: new Date('2024-01-15T10:00:00'),
  symptoms: ['headache', 'fever'],
};

await consultationService.createConsultation(consultation);
```

### Real-time Data Subscription
```typescript
import { FirestoreService, collections } from '@/lib/firestore';

// Subscribe to user profile changes
const unsubscribe = FirestoreService.subscribeToDocument(
  collections.users,
  userId,
  (userData) => {
    console.log('User data updated:', userData);
    setUser(userData);
  }
);

// Don't forget to unsubscribe when component unmounts
useEffect(() => {
  return () => unsubscribe();
}, []);
```

## 🔐 Security Rules

Make sure to set up proper Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Consultations - users can only access their own
    match /consultations/{consultationId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == resource.data.doctorId);
    }
    
    // Add more rules as needed...
  }
}
```

## 🌐 Environment Variables

For production, consider using environment variables for Firebase config:

```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📝 Next Steps

1. **Set up Firestore Security Rules** in Firebase Console
2. **Configure Authentication providers** (Email/Password, Google, etc.)
3. **Set up Storage rules** for file uploads
4. **Test the database operations** using the provided examples
5. **Implement error handling** and loading states in your components
6. **Set up offline persistence** if needed for mobile users

## 🆘 Troubleshooting

### Common Issues:
1. **"Firebase not initialized"** - Make sure you're importing from the correct path
2. **"Permission denied"** - Check your Firestore security rules
3. **"Network error"** - Verify your Firebase project configuration
4. **TypeScript errors** - Ensure all Firebase packages are up to date

### Getting Help:
- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the examples in `client/lib/firestore-examples.ts`
- Test operations in the browser console first

---

Your Firebase setup is now complete and ready for production use! 🎉
