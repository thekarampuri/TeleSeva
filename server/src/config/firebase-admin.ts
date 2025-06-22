import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let firebaseApp: admin.app.App;

export const initializeFirebaseAdmin = () => {
  if (!firebaseApp) {
    // Initialize with service account key or default credentials
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Use default credentials (for local development or cloud deployment)
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'teleseva-7e1c4',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'teleseva-7e1c4.firebasestorage.app',
      });
    }
  }
  return firebaseApp;
};

export const auth = () => getAuth(firebaseApp);
export const db = () => getFirestore(firebaseApp);
export const storage = () => getStorage(firebaseApp);

export default firebaseApp;
