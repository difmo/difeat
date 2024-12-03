// src/App.js
import React, { lazy, Suspense ,useContext, useEffect, useState} from "react";
import { RouterProvider } from "react-router-dom";
import userContext, { UserProvider } from "./utils/userContext";
import {userRouter,sellerRouter} from "./router";
import {
  auth, onAuthStateChanged, firestore, storage, signOut, PhoneAuthProvider, RecaptchaVerifier,
  signInWithCredential, doc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc,
  ref, uploadBytes, getDownloadURL
} from "../firebase";

const App = () => {
  const { user } = useContext(userContext);
  // const navigate = useNavigate()
  console.log('user from local : ',user);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails,setUserDetails]=useState(null);
  const [isStoreKeeper,setIsStoreKeeper]=useState(false);
  // useEffect(() => {
  //   const fetchUserData = async (userUid) => {
  //     try {
  //       const userDocRef = doc(firestore, "difeatusers", userUid);
  //       const userDoc = await getDoc(userDocRef);
  //       if (userDoc.exists()) {
  //         const userData = userDoc.data();
  //         setIsStoreKeeper(userData?.roles?.isStoreKeeper || false);
  //         console.log('user from online  : ',userData);
  //       }

  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   // const unsubscribe = onAuthStateChanged(auth, (user) => {
  //   //   if (user) {
  //   //     fetchUserData(user.uid);
  //   //   } else {
  //   //     // navigate("/");
  //   //   }
  //   // });

  //   // return () => unsubscribe();
  // }, []);





return (  
  <UserProvider>
    <RouterProvider router={!user||!isStoreKeeper?userRouter:sellerRouter} />
  </UserProvider>
);
}
export default App; 