import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth, collection, firestore, doc, getDocs, deleteDoc, query, where, updateDoc, getDoc } from "../../../firebase";
import EditProfile from "../EditProfile";
import LoaderComponent from "../LoaderComponent";

const Store = () => {
  const [userId, setUserId] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      fetchUserRoleAndStore(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserRoleAndStore = async (userId) => {
    try {
      const storesCollectionRef = collection(firestore, "stores");
      const q = query(storesCollectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const storeDoc = querySnapshot.docs[0];
        setStoreData(storeDoc.data());
        console.log('Store data:', storeDoc.data());
      } else {
        console.log("No store found for this user.");
      }

    } catch (error) {
      console.error("Error fetching user data or store:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreStatus = async () => {
    if (storeData) {
      try {
        setLoading(true);
        const storeDocRef = doc(firestore, "stores", storeData.storeId);
        const storeDocSnap = await getDoc(storeDocRef);

        if (storeDocSnap.exists()) {
          const currentStatus = storeDocSnap.data().status;
          const newStatus = !currentStatus;

          await updateDoc(storeDocRef, { status: newStatus });

          // Update the local state to reflect the new status
          setStoreData(prevState => ({
            ...prevState,
            status: newStatus, // Update the local status
          }));

          console.log("Store status updated successfully!");
          setLoading(false);
        } else {
          console.log("Store document not found!");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error updating store status:", error);
        setLoading(false);
      }
    }
  };

  const handleEditStore = () => {
    if (storeData && storeData.storeId) {
      navigate(`/edit-store/${storeData.storeId}`);
    } else {
      console.error("Store ID is undefined or missing");
    }
  };

  if (loading) {
    return (
      <LoaderComponent/>
      
    );
  }

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-full sm:max-w-xl lg:max-w-2xl mx-auto">
      <h3 className="font-semibold text-xl sm:text-2xl mb-4">Store Details</h3>

      {/* Store Image */}
      {storeData && storeData.storeImageUrl && (
        <div className="mb-6 flex justify-center">
          <img
            src={storeData.storeImageUrl}
            alt={`${storeData.storeName} Logo`}
            className="w-32 h-32 object-cover rounded-full sm:w-40 sm:h-40"
          />
        </div>
      )}

      {/* Store Name and Description */}
      {storeData ? (
        <div>
          <div className="mb-4">
            <p className="font-medium text-lg sm:text-xl">
              <strong>Shop Name:</strong> {storeData.storeName}
            </p>
            <p className="text-gray-600 sm:text-lg">
              <strong>Description:</strong> {storeData.shopDescription}
            </p>
            <p className="text-gray-600 sm:text-lg">
              <strong>Address:</strong> {storeData.address.line1}, {storeData.address.city}, {storeData.address.zipCode}
            </p>
          </div>

          {/* Store Verification Status */}
          <div className="mb-4">
            <p>
              <strong>Status:</strong>
              {storeData.isVerified ? (
                <span className="text-green-600"> Store Verified</span>
              ) : (
                <span className="text-red-600"> Not Verified</span>
              )}
            </p>
          </div>

          {/* Store Status Switch */}
          <div className="flex items-center space-x-4 mb-6">
            <p className="font-medium text-lg sm:text-xl">Store Status:</p>
            <div className="flex items-center">
              <label htmlFor="statusToggle" className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="statusToggle"
                  className="sr-only peer"
                  checked={storeData.status}
                  onChange={handleStoreStatus}
                />
                <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 peer-checked:after:translate-x-6 peer-checked:after:bg-white peer-checked:after:border-green-600 after:content-[''] after:absolute after:left-0.5 after:top-0.5 after:w-5 after:h-5 after:bg-white after:border after:rounded-full transition-all"></div>
              </label>
            </div>
            <span className="ml-2 text-sm sm:text-base text-gray-500">
              {storeData.status ? "Open" : "Closed"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <button
              onClick={handleEditStore}
              className="bg-blue-600 text-white py-2 px-4 rounded-md w-full sm:w-auto mb-2 sm:mb-0"
            >
              Edit Store
            </button>
            <button
              onClick={handleStoreStatus}
              className={`py-2 px-4 rounded-md w-full sm:w-auto ${storeData.status ? 'bg-green-600' : 'bg-red-600'} text-white`}
            >
              {storeData.status ? "STORE IS OPEN" : "STORE IS CLOSED"}
            </button>
          </div>
        </div>
      ) : (
        <p>No store found. You can create one by filling out the form below.</p>
      )}
    </div>
  );
};

export default Store;
