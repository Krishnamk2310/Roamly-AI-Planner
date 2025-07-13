// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOFird8QJzwiTPFbxdbI_V-LK7oAoILfI",
  authDomain: "ai-tripplanner-a8807.firebaseapp.com",
  projectId: "ai-tripplanner-a8807",
  storageBucket: "ai-tripplanner-a8807.firebasestorage.app", 
  messagingSenderId: "79084739172",
  appId: "1:79084739172:web:c3af7f531a6c52011f1d71",
  measurementId: "G-Y6YST2EEEF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
