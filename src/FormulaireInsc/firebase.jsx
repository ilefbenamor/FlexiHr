// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDifV480Vl2tLLcy1TdBYmfncKokhu85OA",
  authDomain: "gestion-rh-a7b81.firebaseapp.com",
  projectId: "gestion-rh-a7b81",
  storageBucket: "gestion-rh-a7b81.firebasestorage.app",
  messagingSenderId: "669896190260",
  appId: "1:669896190260:web:d73b661510a44c822a1d61",
  measurementId: "G-3VFRRMQMRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export{db, auth};