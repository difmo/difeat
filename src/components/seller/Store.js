import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaSignOutAlt } from "react-icons/fa";
import { auth, signOut, firestore, doc, getDoc, deleteDoc } from "../../../firebase";

const Store = () => {
  const [userId, setUserId] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [isStoreKeeper, setIsStoreKeeper] = useState(false);
  const [loading, setLoading] = useState(true);
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



  const handleDeleteStore = async () => {
    if (storeData) {
      try {
        const storeDocRef = doc(firestore, "stores", storeData.id);
        await deleteDoc(storeDocRef);
        console.log("Store deleted successfully!");
        setStoreData(null); // Reset store data
      } catch (error) {
        console.error("Error deleting store:", error);
      }
    }
  };


 

  const handleEditStore = () => {
    if (storeData && storeData.storeId) {
      // Redirect to the edit store page with the store ID
      // For example, using `useNavigate` if using React Router v6+
      navigate(`/edit-store/${storeData.storeId}`);
    } else {
      console.error("Store ID is undefined or missing");
    }
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold mb-2">Store Details</h3>
      {isStoreKeeper ? (
        storeData ? (
          <div>
            {storeData.storeImageUrl && (
              <div className="mb-4">
                <img
                  src={storeData.storeImageUrl}
                  alt={`${storeData.storeName} Logo`}
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
            <div>
              <p><strong>Shop Name:</strong> {storeData.storeName}</p>
              <p><strong>Description:</strong> {storeData.shopDescription}</p>
              <p><strong>Address:</strong> {storeData.address.line1}, {storeData.address.city}, {storeData.address.zipCode}</p>

              {/* Shop Status */}
              <p>
                <strong>Status: </strong>
                {storeData.isVerified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-red-600">Not Verified</span>
                )}
              </p>

              {/* Add more store fields as needed */}
            </div>

            <button onClick={handleEditStore} className="bg-blue-600 text-white py-2 px-4 rounded-md">
              Edit Store
            </button>

            <button onClick={handleDeleteStore} className="bg-red-600 text-white py-2 px-4 rounded-md ml-2">
              Delete Store
            </button>
          </div>
        ) : (
          <p>No store found. You can create one by filling out the form below.</p>
        )
      ) : (
        <p>You are not a storekeeper. Please become one by filling out the form below.</p>
      )}

     
    </div>
  );
};

export default Store;
