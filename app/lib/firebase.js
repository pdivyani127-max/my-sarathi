import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC5Ao3BAxEkYSWfKrykDlFvTnDpubyY89s",
  authDomain: "sarathi-6ce38.firebaseapp.com",
  databaseURL: "https://sarathi-6ce38-default-rtdb.firebaseio.com",
  projectId: "sarathi-6ce38",
  storageBucket: "sarathi-6ce38.firebasestorage.app",
  messagingSenderId: "879353855091",
  appId: "1:879353855091:web:66177eccbd01b782a6fe06",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
