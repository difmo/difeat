import { initializeApp } from "firebase/app";
import { getAuth, PhoneAuthProvider, RecaptchaVerifier ,signInWithCredential} from "firebase/auth";

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

export { auth, PhoneAuthProvider, RecaptchaVerifier ,signInWithCredential};
