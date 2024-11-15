import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSignOutAlt } from "react-icons/fa";
import { auth, signOut, firestore, doc, getDoc, deleteDoc } from "../../firebase";
import BecomeStoreKeeperForm from "./seller/BecomeStoreKeeperForm";

const Settings = () => {
  const [userId, setUserId] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [isStoreKeeper, setIsStoreKeeper] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isStoreForm, setStoreForm] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      fetchUserRoleAndStore(currentUser.uid);
    } else {
      setLoading(false); // Stop loading if no user is logged in
    }
  }, []);

  const fetchUserRoleAndStore = async (userId) => {
    try {
      const userDocRef = doc(firestore, "difeatusers", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setIsStoreKeeper(userData.roles?.isStoreKeeper || false);

        // If user is a storekeeper, fetch store data
        if (userData.roles?.isStoreKeeper) {
          const storeDocRef = doc(firestore, "stores", userData.storeKeeperData);
          const storeDocSnap = await getDoc(storeDocRef);

          if (storeDocSnap.exists()) {
            setStoreData(storeDocSnap.data());
          } else {
            console.log("No store found for this user.");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data or store:", error);
    } finally {
      setLoading(false);
    }
  };





  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold mb-2">Store Details</h3>
      <button onClick={() => {
        setStoreForm(!isStoreForm);
      }} className="bg-red-600 text-white py-2 px-4 rounded-md ml-2">
        Become a seller
      </button>
      {isStoreForm ? <BecomeStoreKeeperForm userId={userId}/> : <h1></h1>}
    </div>
  );
};

export default Settings;
