import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCwkvT71ftDARfdxll0o4f7Yvm4Eqzg-tE",
  authDomain: "chatapp-61dd6.firebaseapp.com",
  projectId: "chatapp-61dd6",
  storageBucket: "chatapp-61dd6.appspot.com",
  messagingSenderId: "1022253541938",
  appId: "1:1022253541938:web:419674b9df7f39a6bb6a2b",
  measurementId: "G-SKM89WC4F8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore()

export {db}