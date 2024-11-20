import React, { useEffect, useState } from "react";
import {
  auth,
  onAuthStateChanged,
  firestore,
  signOut,
  doc,
  getDoc,
  collection,
  getDocs,
} from "../../firebase";
import {
  FaSignOutAlt,
  FaUserEdit,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Orders from "./Orders";
import Addresses from "./Addresses";
import Settings from "./Settings";
import EditProfile from "./EditProfile";
import LoaderComponent from "./LoaderComponent";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Orders");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        }

        const ordersCollectionRef = collection(
          firestore,
          "difeatusers",
          userUid,
          "orders"
        );
        const ordersSnapshot = await getDocs(ordersCollectionRef);
        setOrders(ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        const addressesCollectionRef = collection(
          firestore,
          "difeatusers",
          userUid,
          "addresses"
        );
        const addressesSnapshot = await getDocs(addressesCollectionRef);
        setAddresses(
          addressesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
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

  if (isLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#fef4e8] to-[#ffe6d4]">
      {/* Sidebar */}
      <div className="bg-[#fc8019] text-white p-6 flex flex-col w-64 shadow-lg">
        <div className="mb-8 text-center">
          <img
            src={userDetails?.profile?.profileImageUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-md"
          />
          <h2 className="text-2xl font-bold">{userDetails?.profile?.name}</h2>
          <p className="text-sm opacity-80 mt-1">{userDetails?.profile?.email}</p>
        </div>

        <nav className="flex flex-col space-y-4">
          {[
            { label: "Edit Profile", icon: <FaUserEdit />, tab: "EditProfile" },
            { label: "Orders", icon: <FaShoppingBag />, tab: "Orders" },
            { label: "Addresses", icon: <FaMapMarkerAlt />, tab: "Addresses" },
            { label: "Settings", icon: <FaCog />, tab: "Settings" },
          ].map(({ label, icon, tab }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#ff6700] shadow-md scale-105"
                  : "bg-opacity-10 hover:bg-opacity-20"
              }`}
            >
              <span className="mr-3 text-lg">{icon}</span>
              <span className="font-medium">{label}</span>
            </button>
          ))}

          <button
            onClick={() => signOut(auth)}
            className="flex items-center mt-auto py-3 px-4 rounded-lg bg-opacity-10 hover:bg-opacity-20 transition-all duration-300"
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            <span className="font-medium">Sign Out</span>
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 bg-white shadow-md rounded-tl-lg">
        {activeTab === "EditProfile" && (
          <EditProfile userDetails={userDetails} setUserDetails={setUserDetails} />
        )}
        {activeTab === "Orders" && <Orders orders={orders} />}
        {activeTab === "Addresses" && <Addresses addresses={addresses} />}
        {activeTab === "Settings" && <Settings />}
      </div>
    </div>
  );
};

export default Profile;
