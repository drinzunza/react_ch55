// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY6X6OGhKHJkpmK98iwcOt-t33Z5oghXM",
  authDomain: "fsdi-react.firebaseapp.com",
  projectId: "fsdi-react",
  storageBucket: "fsdi-react.firebasestorage.app",
  messagingSenderId: "298733693117",
  appId: "1:298733693117:web:ff0f3da0fbfbb3a91bafd4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app); 