import React, { useState, useEffect } from "react";
import { 
    auth, firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs 
} from "../../firebase";
import { FaHome, FaBriefcase, FaBuilding, FaTrashAlt, FaEdit, FaPlusCircle } from "react-icons/fa";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isEditingAddress, setIsEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ label: "", line1: "", city: "", zipCode: "" });

  // Fetch addresses from Firestore
  useEffect(() => {
    const fetchAddresses = async () => {
      const addressesCollectionRef = collection(firestore, "difeatusers", auth.currentUser.uid, "addresses");
      const addressSnapshot = await getDocs(addressesCollectionRef);
      const addressesList = addressSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAddresses(addressesList);
    };
    fetchAddresses();
  }, []);

  // Add a new address
  const handleAddAddress = async () => {
    try {
      const addressesCollectionRef = collection(firestore, "difeatusers", auth.currentUser.uid, "addresses");
      const docRef = await addDoc(addressesCollectionRef, newAddress);
      setAddresses([...addresses, { id: docRef.id, ...newAddress }]);
      setNewAddress({ label: "", line1: "", city: "", zipCode: "" });
      alert("Address added successfully.");
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  // Update an existing address
  const handleSaveEdit = async (addressId) => {
    try {
      const addressDocRef = doc(firestore, "difeatusers", auth.currentUser.uid, "addresses", addressId);
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
      const addressDocRef = doc(firestore, "difeatusers", auth.currentUser.uid, "addresses", addressId);
      await deleteDoc(addressDocRef);
      setAddresses(addresses.filter((address) => address.id !== addressId));
      alert("Address deleted successfully.");
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Manage Addresses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="border p-4 rounded-lg shadow-sm">
            {isEditingAddress && isEditingAddress.id === address.id ? (
              // Inline edit form
              <div>
                <select
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingAddress.label}
                  onChange={(e) =>
                    setIsEditingAddress({ ...isEditingAddress, label: e.target.value })
                  }
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingAddress.line1}
                  onChange={(e) =>
                    setIsEditingAddress({ ...isEditingAddress, line1: e.target.value })
                  }
                  placeholder="Address Line 1"
                />
                <input
                  type="text"
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingAddress.city}
                  onChange={(e) =>
                    setIsEditingAddress({ ...isEditingAddress, city: e.target.value })
                  }
                  placeholder="City"
                />
                <input
                  type="text"
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingAddress.zipCode}
                  onChange={(e) =>
                    setIsEditingAddress({ ...isEditingAddress, zipCode: e.target.value })
                  }
                  placeholder="Zip Code"
                />
                <div className="flex space-x-4 mt-2">
                  <button onClick={() => handleSaveEdit(address.id)} className="text-green-600">
                    Save
                  </button>
                  <button onClick={() => setIsEditingAddress(null)} className="text-red-600">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display address details
              <div>
                <div className="flex items-center mb-2">
                  <IconBasedOnLabel label={address.label} />
                  <h3 className="font-semibold text-lg ml-2">{address.label}</h3>
                </div>
                <p>{address.line1}</p>
                <p>{address.city}, {address.zipCode}</p>
                <div className="flex space-x-4 mt-2">
                  <button onClick={() => setIsEditingAddress(address)} className="text-red-600">
                  Edit
                  </button>
                  <button onClick={() => handleDeleteAddress(address.id)} className="text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Address Form */}
      <h3 className="mt-6 text-xl font-semibold">Add New Address</h3>
      <div className="flex flex-col md:flex-row gap-2 mt-2">
        <select
          className="border p-2 rounded mb-2 w-full"
          value={newAddress.label}
          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
        >
          <option value="">Select Label</option>
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          className="border p-2 rounded mb-2 w-full"
          value={newAddress.line1}
          onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
          placeholder="Address Line 1"
        />
        <input
          type="text"
          className="border p-2 rounded mb-2 w-full"
          value={newAddress.city}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          placeholder="City"
        />
        <input
          type="text"
          className="border p-2 rounded mb-2 w-full"
          value={newAddress.zipCode}
          onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
          placeholder="Zip Code"
        />
        <button onClick={handleAddAddress} className="bg-green-500 text-white px-4 py-2 rounded">
          <FaPlusCircle className="inline mr-2" /> Add Address
        </button>
      </div>
    </div>
  );
};

// Function to render icons based on address label
const IconBasedOnLabel = ({ label }) => {
  switch (label) {
    case "Home":
      return <FaHome className="text-lg mr-2" />;
    case "Work":
      return <FaBriefcase className="text-lg mr-2" />;
    default:
      return <FaBuilding className="text-lg mr-2" />;
  }
};

export default Addresses;
