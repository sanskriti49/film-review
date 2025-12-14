// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: "AIzaSyDtRmfu8NMX6YktQGMcXGiyLWKqg9N8CWw",
	authDomain: "cinebuzz-61370.firebaseapp.com",
	projectId: "cinebuzz-61370",
	storageBucket: "cinebuzz-61370.firebasestorage.app",
	messagingSenderId: "134359181674",
	appId: "1:134359181674:web:1fa7ac15a01dffae249d13",
	measurementId: "G-RC9Q7SX643",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
