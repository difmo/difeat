import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore, doc, updateDoc, getDoc, storage, ref, uploadBytes, getDownloadURL } from "../../../firebase";

const EditStore = () => {
  const { storeId } = useParams(); // Store ID from URL params
  const navigate = useNavigate();

  const [storeData, setStoreData] = useState(null);
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    addressLine1: "",
    city: "",
    zipCode: "",
    latitude: "",
    longitude: "",
    businessLicense: "",
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    shopLogo: null, // For storing file input
  });

  const [isUploading, setIsUploading] = useState(false);

  // Fetch the store data based on store ID
  useEffect(() => {
    const fetchStoreData = async () => {
      const storeDocRef = doc(firestore, "stores", storeId);
      const storeDocSnap = await getDoc(storeDocRef);

      if (storeDocSnap.exists()) {
        const data = storeDocSnap.data();
        setStoreData(data);
        setFormData({
          shopName: data.shopName,
          shopDescription: data.shopDescription,
          addressLine1: data.address.line1,
          city: data.address.city,
          zipCode: data.address.zipCode,
          latitude: data.address.location.lat,
          longitude: data.address.location.lng,
          businessLicense: data.businessLicense,
          accountHolderName: data.bankDetails.accountHolderName,
          accountNumber: data.bankDetails.accountNumber,
          bankName: data.bankDetails.bankName,
          ifscCode: data.bankDetails.ifscCode,
          shopLogo: null, // Reset logo as it's optional
        });
      } else {
        console.log("Store not found");
      }
    };

    fetchStoreData();
  }, [storeId]);

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle logo change
  const handleLogoChange = (e) => {
    setFormData((prevData) => ({ ...prevData, shopLogo: e.target.files[0] }));
  };

  // Handle updating the store data
  const handleUpdateStore = async (e) => {
    e.preventDefault();

    const {
      shopName, shopDescription, addressLine1, city, zipCode,
      latitude, longitude, businessLicense, accountHolderName,
      accountNumber, bankName, ifscCode, shopLogo,
    } = formData;

    const updatedStoreData = {
      shopName,
      shopDescription,
      address: {
        line1: addressLine1,
        city,
        zipCode,
        location: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
        },
      },
      businessLicense,
      bankDetails: {
        accountHolderName,
        accountNumber,
        bankName,
        ifscCode,
      },
    };

    if (shopLogo) {
      setIsUploading(true);
      try {
        // Upload the new logo if present
        const storageRef = ref(storage, `storesLogos/${shopLogo.name}`);
        await uploadBytes(storageRef, shopLogo);
        const logoUrl = await getDownloadURL(storageRef);
        updatedStoreData.shopLogo = logoUrl; // Update logo URL
      } catch (error) {
        console.error("Error uploading logo:", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      updatedStoreData.shopLogo = storeData.shopLogo; // Keep the existing logo if no new one
    }

    // Update the store document in Firestore
    try {
      const storeDocRef = doc(firestore, "stores", storeId);
      await updateDoc(storeDocRef, updatedStoreData);
      console.log("Store updated successfully!");
      alert("Store updated successfully!");
      navigate("/profile"); // Redirect to settings page after successful update
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  if (!storeData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold mb-4 text-xl">Edit Store</h3>
      <form onSubmit={handleUpdateStore}>
        {/* Shop Name */}
        <div className="mb-4">
          <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
            Shop Name
          </label>
          <input
            type="text"
            id="shopName"
            name="shopName"
            value={formData.shopName}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Shop Description */}
        <div className="mb-4">
          <label htmlFor="shopDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="shopDescription"
            name="shopDescription"
            value={formData.shopDescription}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            rows="4"
            required
          />
        </div>

        {/* Address Line 1 */}
        <div className="mb-4">
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Zip Code */}
        <div className="mb-4">
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Latitude */}
        <div className="mb-4">
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Longitude */}
        <div className="mb-4">
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Business License */}
        <div className="mb-4">
          <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700">
            Business License
          </label>
          <input
            type="text"
            id="businessLicense"
            name="businessLicense"
            value={formData.businessLicense}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Account Holder Name */}
        <div className="mb-4">
          <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
            Account Holder Name
          </label>
          <input
            type="text"
            id="accountHolderName"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Account Number */}
        <div className="mb-4">
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Bank Name */}
        <div className="mb-4">
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* IFSC Code */}
        <div className="mb-4">
          <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
            IFSC Code
          </label>
          <input
            type="text"
            id="ifscCode"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleInputChange}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Shop Logo (Optional) */}
        <div className="mb-4">
          <label htmlFor="shopLogo" className="block text-sm font-medium text-gray-700">
            Shop Logo (Optional)
          </label>
          <input
            type="file"
            id="shopLogo"
            name="shopLogo"
            onChange={handleLogoChange}
            className="mt-1 p-2 border rounded-md w-full"
            accept="image/*"
          />
          {formData.shopLogo && <p className="mt-2 text-sm text-gray-500">Selected file: {formData.shopLogo.name}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Update Store"}
        </button>
      </form>
    </div>
  );
};

export default EditStore;
