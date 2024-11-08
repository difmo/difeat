import React, { useEffect, useState } from "react";
import { auth, firestore, storage } from "../../firebase"; // Include Firebase Storage
import { doc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaUserEdit, FaMapMarkerAlt, FaShoppingBag, FaSignOutAlt, FaPlusCircle, FaTrashAlt, FaEdit, FaCamera } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For handling image uploads

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(null);
  const [editFormData, setEditFormData] = useState({ displayName: "", email: "", phoneNumber: "" });
  const [newAddress, setNewAddress] = useState({ line1: "", city: "", zipCode: "" });
  const [profileImage, setProfileImage] = useState(null); // For new profile image file
  const [profileImageUrl, setProfileImageUrl] = useState(""); // For previewing image URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
          setEditFormData(userData);
          setProfileImageUrl(userData.profileImageUrl || "");
        }

        const ordersCollectionRef = collection(firestore, "difeatusers", userUid, "orders");
        const ordersSnapshot = await getDocs(ordersCollectionRef);
        const ordersData = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);

        const addressesCollectionRef = collection(firestore, "difeatusers", userUid, "addresses");
        const addressesSnapshot = await getDocs(addressesCollectionRef);
        const addressesData = addressesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAddresses(addressesData);
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

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddAddress = async () => {
    try {
      const addressesCollectionRef = collection(firestore, "difeatusers", userDetails.uid, "addresses");
      const newAddressDoc = await addDoc(addressesCollectionRef, newAddress);
      setAddresses([...addresses, { id: newAddressDoc.id, ...newAddress }]);
      setNewAddress({ line1: "", city: "", zipCode: "" });
      alert("Address added successfully.");
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleEditAddress = async (addressId) => {
    try {
      const addressDocRef = doc(firestore, "difeatusers", userDetails.uid, "addresses", addressId);
      await updateDoc(addressDocRef, isEditingAddress);
      setAddresses(
        addresses.map((address) => (address.id === addressId ? isEditingAddress : address))
      );
      setIsEditingAddress(null);
      alert("Address updated successfully.");
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

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
              <img src={profileImageUrl || "https://via.placeholder.com/150"} alt="Profile" className="w-32 h-32 rounded-full object-cover border border-gray-300" />
              <label htmlFor="profileImage" className="absolute bottom-0 right-0 p-2 bg-gray-200 rounded-full cursor-pointer">
                <FaCamera className="text-gray-700" />
              </label>
              <input type="file" id="profileImage" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
            </div>
            <input type="text" className="border border-gray-300 p-2 rounded mb-2 w-full" value={editFormData.displayName} onChange={(e) => setEditFormData({ ...editFormData, displayName: e.target.value })} placeholder="Display Name" />
            <input type="email" className="border border-gray-300 p-2 rounded mb-2 w-full" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} placeholder="Email" />
            <button onClick={handleEditProfile} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </div>
        ) : (
          <div className="text-center">
            <img src={profileImageUrl || "https://via.placeholder.com/150"} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto mb-4" />
            <p className="text-lg font-medium">Name: {userDetails?.displayName}</p>
            <p className="text-lg font-medium">Email: {userDetails?.email}</p>
            <button onClick={() => setIsEditingProfile(true)} className="mt-4 text-blue-500 flex items-center">
              <FaUserEdit className="mr-2" /> Edit Profile
            </button>
          </div>
        )}
      </div>

      <h3 className="mt-6 font-semibold">Addresses</h3>
      {addresses.map((address) => (
        <div key={address.id} className="bg-white p-4 rounded-lg shadow-md my-2">
          {isEditingAddress && isEditingAddress.id === address.id ? (
            <div>
              <input type="text" value={isEditingAddress.line1} onChange={(e) => setIsEditingAddress({ ...isEditingAddress, line1: e.target.value })} />
              <button onClick={() => handleEditAddress(address.id)}>Save</button>
            </div>
          ) : (
            <div>
              <p>{address.line1}, {address.city}</p>
              <button onClick={() => setIsEditingAddress(address)}><FaEdit /> Edit</button>
              <button onClick={() => handleDeleteAddress(address.id)}><FaTrashAlt /> Delete</button>
            </div>
          )}
        </div>
      ))}
      <button onClick={handleAddAddress}><FaPlusCircle /> Add Address</button>

      <h3 className="mt-6 font-semibold">Orders</h3>
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-lg shadow-md my-2">
          <p>Order ID: {order.id}</p>
          <p>Items: {order.items}</p>
          <p>Total: ${order.total}</p>
        </div>
      ))}

      <button onClick={() => auth.signOut()}><FaSignOutAlt /> Logout</button>
    </div>
  );
};

export default Profile;
