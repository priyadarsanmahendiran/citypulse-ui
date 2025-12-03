import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCJrixgwyd_NKbFQsQLEk24yPgoOEZRTHQ",
  authDomain: "citypulse-f06b0.firebaseapp.com",
  projectId: "citypulse-f06b0",
  storageBucket: "citypulse-f06b0.firebasestorage.app",
  messagingSenderId: "114932213688",
  appId: "1:114932213688:web:a90df716c928f0f7c1514d",
  measurementId: "G-WN5PP6FLN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };