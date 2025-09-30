// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKBEpkybK4Et7MyEMfkSj02aku2R8d6yk",
  authDomain: "react-native-lear.firebaseapp.com",
  databaseURL: "https://react-native-lear-default-rtdb.firebaseio.com",
  projectId: "react-native-lear",
  storageBucket: "react-native-lear.firebasestorage.app",
  messagingSenderId: "409233267382",
  appId: "1:409233267382:web:0ae2b1227f5f94baf6e417",
  measurementId: "G-RVKTN4NNB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const database = getDatabase();
const firestore = getFirestore(app);

export { auth, database, firestore }