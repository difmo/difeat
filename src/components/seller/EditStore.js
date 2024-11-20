import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore, doc, updateDoc, getDoc, storage, ref, uploadBytes, getDownloadURL, deleteObject } from "../../../firebase";
import LoaderComponent from "../LoaderComponent";

const EditStore = () => {
  const { storeId } = useParams(); // Store ID from URL params
  const navigate = useNavigate();

  const [storeData, setStoreData] = useState(null);
  const [formData, setFormData] = useState({
    storeName: "",
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
    storeImageUrl: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeDocRef = doc(firestore, "stores", storeId);
        const storeDocSnap = await getDoc(storeDocRef);

        if (storeDocSnap.exists()) {
          const data = storeDocSnap.data();
          setStoreData(data);
          setFormData({
            storeName: data.storeName || "",
            shopDescription: data.shopDescription || "",
            addressLine1: data.address.line1 || "",
            city: data.address.city || "",
            zipCode: data.address.zipCode || "",
            latitude: data.address.location.lat || "",
            longitude: data.address.location.lng || "",
            businessLicense: data.businessLicense || "",
            accountHolderName: data.bankDetails.accountHolderName || "",
            accountNumber: data.bankDetails.accountNumber || "",
            bankName: data.bankDetails.bankName || "",
            ifscCode: data.bankDetails.ifscCode || "",
            storeImageUrl: data.storeImageUrl || null,
          });
        } else {
          setErrorMessage("Store not found.");
        }
      } catch (error) {
        setErrorMessage("Error fetching store data. Please try again.");
      }
    };

    fetchStoreData();
  }, [storeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogoChange = (e) => {
    setFormData((prevData) => ({ ...prevData, storeImageUrl: e.target.files[0] }));
  };

  const handleRemoveLogo = async () => {
    if (storeData.storeImageUrl) {
      try {
        const storageRef = ref(storage, storeData.storeImageUrl);
        await deleteObject(storageRef);
        setFormData((prevData) => ({ ...prevData, storeImageUrl: null }));
      } catch (error) {
        setErrorMessage("Error removing store image. Please try again.");
      }
    }
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const {
      storeName, shopDescription, addressLine1, city, zipCode,
      latitude, longitude, businessLicense, accountHolderName,
      accountNumber, bankName, ifscCode, storeImageUrl,
    } = formData;

    const updatedStoreData = {
      storeName,
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

    try {
      if (storeImageUrl) {
        setIsUploading(true);
        const storageRef = ref(storage, `storesLogos/${storeImageUrl.name}`);
        await uploadBytes(storageRef, storeImageUrl);
        const logoUrl = await getDownloadURL(storageRef);
        updatedStoreData.storeImageUrl = logoUrl;
      } else {
        updatedStoreData.storeImageUrl = storeData.storeImageUrl;
      }

      const storeDocRef = doc(firestore, "stores", storeId);
      await updateDoc(storeDocRef, updatedStoreData);
      navigate("/");
    } catch (error) {
      setErrorMessage("Error updating store. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!storeData) {
    return <LoaderComponent />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-semibold mb-6">Edit Store Details</h2>
      {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
      <form onSubmit={handleUpdateStore} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="storeName" className="block text-sm font-medium">Store Name</label>
          <input
            type="text"
            name="storeName"
            id="storeName"
            value={formData.storeName}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="shopDescription" className="block text-sm font-medium">Shop Description</label>
          <textarea
            name="shopDescription"
            id="shopDescription"
            value={formData.shopDescription}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="addressLine1" className="block text-sm font-medium">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            id="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="zipCode" className="block text-sm font-medium">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="latitude" className="block text-sm font-medium">Latitude</label>
            <input
              type="number"
              name="latitude"
              id="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="longitude" className="block text-sm font-medium">Longitude</label>
            <input
              type="number"
              name="longitude"
              id="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="businessLicense" className="block text-sm font-medium">Business License</label>
          <input
            type="text"
            name="businessLicense"
            id="businessLicense"
            value={formData.businessLicense}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="accountHolderName" className="block text-sm font-medium">Account Holder Name</label>
          <input
            type="text"
            name="accountHolderName"
            id="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="accountNumber" className="block text-sm font-medium">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            id="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bankName" className="block text-sm font-medium">Bank Name</label>
          <input
            type="text"
            name="bankName"
            id="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ifscCode" className="block text-sm font-medium">IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            id="ifscCode"
            value={formData.ifscCode}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Store Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {formData.storeImageUrl && (
            <div className="mt-4">
              <img
                src={formData.storeImageUrl}
                alt="Store"
                className="w-32 h-32 object-cover rounded-md mb-2"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="text-center w-full">
          <button
            type="submit"
            disabled={isUploading}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            {isUploading ? "Updating..." : "Update Store"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStore;
