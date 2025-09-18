import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzHuBNgK2tobPoVbcRjL8tqLTqjIGEGXU",
  authDomain: "wallify-24bff.firebaseapp.com",
  projectId: "wallify-24bff",
  storageBucket: "wallify-24bff.firebasestorage.app",
  messagingSenderId: "909098599892",
  appId: "1:909098599892:web:c6744738ac00b5845a8241",
  measurementId: "G-TDJ8CX1Q4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);