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
    <div className="max-w-full  mt-10 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r bg-[#fc8019] p-6">
        <h2 className="text-2xl font-semibold text-white">{storeData?.storeName}</h2>
        <p className="text-gray-200 text-sm">{storeData?.address?.line1}, {storeData?.address?.city}</p>
        <div className="flex items-center mt-4">
          <span className={`px-3 py-1 text-sm rounded-full ${storeData?.isVerified ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {storeData?.isVerified ? "Verified Store" : "Not Verified"}
          </span>
        </div>
      </div>

      <div className="max-w-full mt-10 bg-white rounded-lg shadow-lg overflow-hidden flex"> <div className="p-6 flex-none"> <img src={storeData?.storeImageUrl || "https://via.placeholder.com/200"} alt={storeData?.storeName} className="w-40 h-40 object-cover rounded-full shadow-md" /> </div> <div className="p-6 flex-grow"> <div className="mb-6"> <p className="text-gray-700"> <strong>Description:</strong> {storeData?.shopDescription || "No description available."} </p> <p className="text-gray-700"> <strong>Category:</strong> {storeData?.category || "Not specified"} </p> <p className="text-gray-700"> <strong>Contact:</strong> {storeData?.contactNumber || "Not available"} </p> <p className="text-gray-700"> <strong>Opening Hours:</strong> {storeData?.openingHours || "Not available"} </p> </div> <div className="flex space-x-4"> <button onClick={handleEditStore} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300" > Edit Store </button> <button onClick={handleStoreStatus} className={`px-4 py-2 rounded-md transition duration-300 ${ storeData?.status ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600" } text-white`} > {storeData?.status ? "Close Store" : "Open Store"} </button> </div> </div> </div>
    </div>
  );
};

export default Store;