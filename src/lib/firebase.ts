import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ32tDvLY7QqBB9CHtPOeElXyTtdNhUuk",
  authDomain: "zoza-gateway.firebaseapp.com",
  projectId: "zoza-gateway",
  storageBucket: "zoza-gateway.firebasestorage.app",
  messagingSenderId: "880288922335",
  appId: "1:880288922335:web:1eda723f5cab1293c3476a",
  measurementId: "G-RM6F1QPJ1J",
};

// Initialize Firebase (avoid duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore database
const db = getFirestore(app);

// Initialize Analytics only in the browser
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, analytics };
