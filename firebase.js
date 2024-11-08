import { initializeApp } from "firebase/app";
import { getAuth, PhoneAuthProvider, RecaptchaVerifier ,signInWithCredential,signOut,onAuthStateChanged} from "firebase/auth";
import { getFirestore, doc, setDoc , getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcyNrL_6sDErQXwG9-do3LANTMh6nQ0T4",
  authDomain: "codechat-45ec2.firebaseapp.com",
  databaseURL: "https://codechat-45ec2-default-rtdb.firebaseio.com",
  projectId: "codechat-45ec2",
  storageBucket: "codechat-45ec2.appspot.com",
  messagingSenderId: "685191561219",
  appId: "1:685191561219:web:2c693251a74426c1e9ce36",
  measurementId: "G-V3SL5V40WY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, signOut,PhoneAuthProvider, RecaptchaVerifier ,signInWithCredential,setDoc,firestore,onAuthStateChanged,doc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc,ref, uploadBytes, getDownloadURL };
