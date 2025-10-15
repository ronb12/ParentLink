import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCBui47DycA3M4yYNJEFtTted8VM8R2S7E",
  authDomain: "parentlink-2024-app.firebaseapp.com",
  projectId: "parentlink-2024-app",
  storageBucket: "parentlink-2024-app.firebasestorage.app",
  messagingSenderId: "319585389643",
  appId: "1:319585389643:web:7b6dbea7bf76e6dcff91ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
