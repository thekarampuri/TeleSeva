// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIM4XY0jDgpfnS7XyRYZMICRzU7aM8iRY",
  authDomain: "teleseva-7e1c4.firebaseapp.com",
  projectId: "teleseva-7e1c4",
  storageBucket: "teleseva-7e1c4.firebasestorage.app",
  messagingSenderId: "225228603135",
  appId: "1:225228603135:web:25bf9a220a4d91517cd6ca",
  measurementId: "G-PRFQQP30SH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
