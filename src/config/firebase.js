import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore/lite';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAn9d8bE3vhC208XYWYiKWyLX_96gAeZkY",
  authDomain: "hassan-portfolio-1.firebaseapp.com",
  projectId: "hassan-portfolio-1",
  storageBucket: "hassan-portfolio-1.appspot.com",
  messagingSenderId: "500787939148",
  appId: "1:500787939148:web:240d69db5d4a0f3af731e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}