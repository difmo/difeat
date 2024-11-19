import React, { useEffect, useState } from "react";
import {
  auth,
  onAuthStateChanged,
  firestore,
  storage,
  signOut,
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../firebase";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Orders from "./Orders";
import Addresses from "./Addresses";
import Settings from "./Settings";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
          const profileData = userData.profile || {};
          setProfileImageUrl(profileData.profileImageUrl || "");
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

  const handleEditProfile = async () => {
    try {
      let imageUrl = profileImageUrl;

      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, profileImage);
        imageUrl = await getDownloadURL(storageRef);
        setProfileImageUrl(imageUrl);
      }

      const userDocRef = doc(firestore, "difeatusers", auth.currentUser.uid);
      const updatedProfile = {
        ...userDetails.profile,
        name: userDetails.profile.name || "Guest",
        email: userDetails.profile.email || "",
        profileImageUrl: imageUrl,
      };

      await updateDoc(userDocRef, { profile: updatedProfile });

      setUserDetails((prevState) => ({
        ...prevState,
        profile: updatedProfile,
      }));

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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8 p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md w-full md:w-1/3 p-6 text-center">
        <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden">
          <img
            src={profileImageUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-full h-full object-cover"
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
          className="border border-gray-300 p-2 rounded mt-4 w-full"
          value={userDetails?.profile?.name || ""}
          onChange={(e) =>
            setUserDetails((prevState) => ({
              ...prevState,
              profile: { ...prevState.profile, name: e.target.value },
            }))
          }
          placeholder="Name"
        />
        <input
          type="email"
          className="border border-gray-300 p-2 rounded mt-2 w-full"
          value={userDetails?.profile?.email || ""}
          onChange={(e) =>
            setUserDetails((prevState) => ({
              ...prevState,
              profile: { ...prevState.profile, email: e.target.value },
            }))
          }
          placeholder="Email"
        />
        <button onClick={handleEditProfile} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full">
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;
