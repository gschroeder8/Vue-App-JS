import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4Yop-YyLu2eDL4o-oJgaZYQKAiA2-oZo",
  authDomain: "javascript2-e4261.firebaseapp.com",
  projectId: "javascript2-e4261",
  storageBucket: "javascript2-e4261.firebasestorage.app",
  messagingSenderId: "170310745169",
  appId: "1:170310745169:web:ab071b87a2d6406f010c70",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const authProvider = new GoogleAuthProvider();

export { auth, authProvider, db };
