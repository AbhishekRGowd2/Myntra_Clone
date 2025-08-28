import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEDPeZZ4cO4jc7lYa0GEc61S_FCJ6-zVw",
  authDomain: "myntra-clone-77425.firebaseapp.com",
  projectId: "myntra-clone-77425",
  storageBucket: "myntra-clone-77425.firebasestorage.app",
  messagingSenderId: "984620447563",
  appId: "1:984620447563:web:7e3af229e81ae36b5d9ace"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
