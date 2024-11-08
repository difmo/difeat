import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase";
import { doc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc } from "../../firebase";
import { onAuthStateChanged, signOut } from "../../firebase";
import { FaUserEdit, FaMapMarkerAlt, FaShoppingBag, FaSignOutAlt, FaPlusCircle, FaTrashAlt, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(null); // Track the address being edited
  const [editFormData, setEditFormData] = useState({ displayName: "", email: "", phoneNumber: "" });
  const [newAddress, setNewAddress] = useState({ line1: "", city: "", zipCode: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
          setEditFormData(userDoc.data());
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
      const userDocRef = doc(firestore, "difeatusers", userDetails.uid);
      await updateDoc(userDocRef, editFormData);
      setUserDetails({ ...userDetails, ...editFormData });
      setIsEditingProfile(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const addressesCollectionRef = collection(firestore, "difeatusers", userDetails.uid, "addresses");
      await addDoc(addressesCollectionRef, newAddress);
      setAddresses([...addresses, newAddress]);
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
          <div>
            <input type="text" value={editFormData.displayName} onChange={(e) => setEditFormData({ ...editFormData, displayName: e.target.value })} />
            <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} />
            <button onClick={handleEditProfile}>Save</button>
          </div>
        ) : (
          <div>
            <p>Name: {userDetails.displayName}</p>
            <p>Email: {userDetails.email}</p>
            <button onClick={() => setIsEditingProfile(true)}><FaUserEdit /> Edit Profile</button>
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
