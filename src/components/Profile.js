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
} from "../../firebase";
import { FaSignOutAlt, FaBox, FaMapMarkerAlt, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Orders from "./Orders";
import Addresses from "./Addresses";
import Settings from "./Settings";
import EditProfile from "./EditProfile";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState("Orders");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
          setProfileImageUrl(userData.profile?.profileImageUrl || ""); // Access profile map field
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-blue-800 text-white p-6 flex flex-col">
        <div className="mb-8">
          <img
            src={profileImageUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-center">{userDetails?.profile?.name}</h2>
          <p className="text-sm opacity-80 mt-1 text-center">{userDetails?.profile?.email}</p>
        </div>

        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => {
              setActiveTab("EditProfile");
            }}
            className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold"
          >
            <FaBox className="mr-3" /> Edit Profile
          </button>

          <button
            onClick={() => {
              setActiveTab("Orders");
            }}
            className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold"
          >
            <FaBox className="mr-3" /> Orders
          </button>

          <button
            onClick={() => setActiveTab("Addresses")}
            className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold"
          >
            <FaMapMarkerAlt className="mr-3" /> Addresses
          </button>
          <button
            onClick={() => setActiveTab("Settings")}
            className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold"
          >
            <FaCog className="mr-3" /> Settings
          </button>
          <button
            onClick={() => signOut(auth)}
            className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold mt-auto"
          >
            <FaSignOutAlt className="mr-3" /> Sign Out
          </button>
        </nav>
      </div>


      <div className="flex-1 p-8">
        {activeTab === "EditProfile" && (<EditProfile userDetails={userDetails} setUserDetails={setUserDetails} profileImageUrl={profileImageUrl} setProfileImageUrl={setProfileImageUrl} />)}
        {activeTab === "Orders" && <Orders orders={orders} />}
        {activeTab === "Addresses" && <Addresses addresses={addresses} />}
        {activeTab === "Settings" && <Settings />}
      </div>

    </div>
  );
};

export default Profile;
