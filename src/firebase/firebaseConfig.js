// Firebase core
import { initializeApp } from "firebase/app";

// Firebase services
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxUGGCJh3RReirQ45ZW3MN_xJ90TSRfmA",
  authDomain: "rc-digitized-research-catalog.firebaseapp.com",
  databaseURL: "https://rc-digitized-research-catalog-default-rtdb.firebaseio.com",
  projectId: "rc-digitized-research-catalog",
  storageBucket: "rc-digitized-research-catalog.firebasestorage.app",
  messagingSenderId: "717355770806",
  appId: "1:717355770806:web:f5a105a3b32f28a0759717",
  measurementId: "G-7CF3G8WRNB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const database = getDatabase(app);

// Optional (safe to keep)
export const analytics = getAnalytics(app);
