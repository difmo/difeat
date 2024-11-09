import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import {
  auth,
  firestore,
  storage,
  signOut,
  doc,
  updateDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  setDoc,
  Timestamp,
  collection
} from "../../../firebase";
import userContext from "../../utils/userContext";

const BecomeStoreKeeperForm = ({ userId }) => {
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();  // Initialize navigate
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

  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, shopLogo: file }));
      const reader = new FileReader();
      reader.onload = () => {
        // image uploaded
        // setProfileImageUrl(reader.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const {
      shopName, shopDescription, addressLine1, city, zipCode,
      latitude, longitude, businessLicense, accountHolderName,
      accountNumber, bankName, ifscCode, shopLogo,
    } = formData;

    // Validate the userId
    if (!userId) {
      setError("User ID is not available. Please log in.");
      return;
    }

    if (Object.values(formData).some((value) => !value && value !== shopLogo)) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      setError("Latitude and Longitude must be valid numbers.");
      return;
    }

    setIsUploading(true); // Start the uploading process

    try {
      let shopLogoUrl = "";
      if (shopLogo) {
        const storageRef = ref(storage, `storesLogos/${shopLogo.name}`);
        await uploadBytes(storageRef, shopLogo);
        shopLogoUrl = await getDownloadURL(storageRef);
      }

      // Create a store document ID using the `doc()` method
      const storeDocRef = doc(collection(firestore, "stores")); // Collection "stores" and auto-generated document ID
      const storeId = storeDocRef.id; // Capture the storeId from the generated doc ref

      // Add store data to Firestore
      await setDoc(storeDocRef, {
        storeId, // Save storeId in the store document
        userId,
        shopName,
        shopDescription,
        shopLogo: shopLogoUrl,
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
        registrationDate: Timestamp.now(),
        isVerified: false,
      });

      // Optionally, update the user document in `difeatusers` to reflect the storekeeper status
      const userDocRef = doc(firestore, "difeatusers", userId);
      await updateDoc(userDocRef, {
        storeKeeperData: storeDocRef.id, // Store the storeId reference in the user document
        roles: {
          isStoreKeeper: true,
          isUser: false, // Set isUser to false, since the user is now a storekeeper
        },
      });

      // Update user context and redirect to the storekeeper dashboard
      const userData = {
        isStoreKeeper: true,  
        isUser: false,         
      };
      setUser(userData);
      
      // Redirect to the seller dashboard
      navigate("/"); // This should point to the seller's dashboard

      alert("You are now a StoreKeeper!");

      // Clear the form data
      setFormData({
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
        shopLogo: null, // Reset the file input
      });
      
    } catch (err) {
      console.error("Error creating store:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsUploading(false); // End the uploading process
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 p-6 bg-white">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {[
          { label: "Shop Name", name: "shopName" },
          { label: "Shop Description", name: "shopDescription" },
          { label: "Address Line 1", name: "addressLine1" },
          { label: "City", name: "city" },
          { label: "Zip Code", name: "zipCode" },
          { label: "Latitude", name: "latitude", type: "number" },
          { label: "Longitude", name: "longitude", type: "number" },
          { label: "Business License", name: "businessLicense" },
          { label: "Account Holder Name", name: "accountHolderName" },
          { label: "Account Number", name: "accountNumber" },
          { label: "Bank Name", name: "bankName" },
          { label: "IFSC Code", name: "ifscCode" },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="font-medium text-gray-700">{field.label}:</label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              required
              className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150"
            />
          </div>
        ))}
      </div>

      {/* Shop Logo Upload Section */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700">Upload Shop Logo:</label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-150"
        />
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-150"
      >
        {isUploading ? "Uploading..." : "Submit and Become StoreKeeper"}
      </button>
    </form>
  );
};

export default BecomeStoreKeeperForm;
