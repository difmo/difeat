import React, { useEffect, useState } from "react";
import { auth, firestore, storage } from "../../firebase"; // Assuming these are configured
import { doc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc,ref, uploadBytes, getDownloadURL } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaUserEdit, FaCamera, FaSignOutAlt, FaPlusCircle, FaTrashAlt, FaEdit } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(null); // Track the address being edited
  const [editFormData, setEditFormData] = useState({ displayName: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(""); // URL for displaying profile image
  const [newAddress, setNewAddress] = useState({ line1: "", city: "", zipCode: "" });
  const navigate = useNavigate();

  // Fetch user data, orders, and addresses on mount
  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
          setEditFormData(userData);
          setProfileImageUrl(userData.profileImageUrl || ""); // Set image URL if available
        }

        const ordersCollectionRef = collection(firestore, "difeatusers", userUid, "orders");
        const ordersSnapshot = await getDocs(ordersCollectionRef);
        setOrders(ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        const addressesCollectionRef = collection(firestore, "difeatusers", userUid, "addresses");
        const addressesSnapshot = await getDocs(addressesCollectionRef);
        setAddresses(addressesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Handle profile updates, including image upload if it has changed
  const handleEditProfile = async () => {
    try {
      let imageUrl = profileImageUrl;

      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, profileImage);
        imageUrl = await getDownloadURL(storageRef);
        setProfileImageUrl(imageUrl);
      }

      const userDocRef = doc(firestore, "difeatusers", userDetails.uid);
      await updateDoc(userDocRef, { ...editFormData, profileImageUrl: imageUrl });
      setUserDetails({ ...userDetails, ...editFormData, profileImageUrl: imageUrl });
      setIsEditingProfile(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle image selection
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Add a new address
  const handleAddAddress = async () => {
    try {
      const addressesCollectionRef = collection(firestore, "difeatusers", userDetails.uid, "addresses");
      const docRef = await addDoc(addressesCollectionRef, newAddress);
      setAddresses([...addresses, { id: docRef.id, ...newAddress }]);
      setNewAddress({ line1: "", city: "", zipCode: "" });
      alert("Address added successfully.");
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  // Update an existing address
  const handleEditAddress = async (addressId) => {
    try {
      const addressDocRef = doc(firestore, "difeatusers", userDetails.uid, "addresses", addressId);
      await updateDoc(addressDocRef, isEditingAddress);
      setAddresses(addresses.map((address) => (address.id === addressId ? isEditingAddress : address)));
      setIsEditingAddress(null);
      alert("Address updated successfully.");
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  // Delete an address
  const handleDeleteAddress = async (addressId) => {
    try {
      const addressDocRef = doc(firestore, "difeatusers", userDetails.uid, "addresses", addressId);
      await deleteDoc(addressDocRef);
      setAddresses(addresses.filter((address) => address.id !== addressId));
      alert("Address deleted successfully.");
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">User Profile</h2>
        {isEditingProfile ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={profileImageUrl || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border border-gray-300"
              />
              <label htmlFor="profileImage" className="absolute bottom-0 right-0 p-2 bg-gray-200 rounded-full cursor-pointer">
                <FaCamera className="text-gray-700" />
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded mb-2 w-full"
              value={editFormData.displayName}
              onChange={(e) => setEditFormData({ ...editFormData, displayName: e.target.value })}
              placeholder="Display Name"
            />
            <input
              type="email"
              className="border border-gray-300 p-2 rounded mb-2 w-full"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              placeholder="Email"
            />
            <button onClick={handleEditProfile} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        ) : (
          <div className="text-center">
            <img
              src={profileImageUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
            />
            <p className="text-lg font-medium">Name: {userDetails?.displayName}</p>
            <p className="text-lg font-medium">Email: {userDetails?.email}</p>
            <button onClick={() => setIsEditingProfile(true)} className="mt-4 text-blue-500 flex items-center">
              <FaUserEdit className="mr-2" /> Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Addresses Section */}
      <h3 className="mt-6 font-semibold">Addresses</h3>
      {addresses.map((address) => (
        <div key={address.id} className="bg-white p-4 rounded-lg shadow-md my-2">
          {isEditingAddress && isEditingAddress.id === address.id ? (
            <div>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded mb-2 w-full"
                value={isEditingAddress.line1}
                onChange={(e) => setIsEditingAddress({ ...isEditingAddress, line1: e.target.value })}
              />
              <button onClick={() => handleEditAddress(address.id)} className="bg-green-500 text-white px-2 py-1 rounded ml-2">Save</button>
            </div>
          ) : (
            <div>
              <p>{address.line1}, {address.city}, {address.zipCode}</p>
              <button onClick={() => setIsEditingAddress(address)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDeleteAddress(address.id)} className="text-red-500 ml-2">Delete</button>
            </div>
          )}
        </div>
      ))}
      <input
        type="text"
        placeholder="New Address Line 1"
        value={newAddress.line1}
        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
        className="border border-gray-300 p-2 rounded mb-2 w-full"
      />
      <button onClick={handleAddAddress} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Add Address
      </button>
      
      <button onClick={() => signOut(auth)} className="mt-4 flex items-center text-red-500">
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </div>
  );
};

export default Profile;
