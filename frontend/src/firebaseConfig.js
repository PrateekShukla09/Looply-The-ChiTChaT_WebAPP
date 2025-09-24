// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCptkj75rMR_EWnTYlvjJ6vdHRkb3leQuo",
  authDomain: "looply-thechitchatwebapp.firebaseapp.com",
  projectId: "looply-thechitchatwebapp",
  storageBucket: "looply-thechitchatwebapp.firebasestorage.app",
  messagingSenderId: "451857234489",
  appId: "1:451857234489:web:426fe255acb3da6feeabe8",
  measurementId: "G-C75WCFZ54D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
