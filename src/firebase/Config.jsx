// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi7TXH_n3b1vivwz9gh9dFB9hkx7bZ4YE",
  authDomain: "docapp-dc95a.firebaseapp.com",
  projectId: "docapp-dc95a",
  storageBucket: "docapp-dc95a.appspot.com",
  messagingSenderId: "690247129712",
  appId: "1:690247129712:web:a13ab010cc389773a0f2b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth }