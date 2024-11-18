import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD4zn4F7W0ChTtUstejzwXjv9xZN7zO7J0",
    authDomain: "fireapp-b2d4e.firebaseapp.com",
    databaseURL: "https://fireapp-b2d4e-default-rtdb.firebaseio.com",
    projectId: "fireapp-b2d4e",
    storageBucket: "fireapp-b2d4e.firebasestorage.app",
    messagingSenderId: "765507867416",
    appId: "1:765507867416:web:08e965e7237919d07b046d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
