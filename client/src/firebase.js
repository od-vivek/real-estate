// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "real-estate-20906.firebaseapp.com",
    projectId: "real-estate-20906",
    storageBucket: "real-estate-20906.appspot.com",
    messagingSenderId: "980405417842",
    appId: "1:980405417842:web:cf71484653c730af604feb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }; 