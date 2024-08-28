// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtAcgJWHtvJ3-gAg41RoD6H2w7HWF9Cko",
  authDomain: "vocabulary-notebook-989d7.firebaseapp.com",
  projectId: "vocabulary-notebook-989d7",
  storageBucket: "vocabulary-notebook-989d7.appspot.com",
  messagingSenderId: "69302078061",
  appId: "1:69302078061:web:bd4e3db5f68102e4f4cd64",
  measurementId: "G-VBETYHF3Z1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };