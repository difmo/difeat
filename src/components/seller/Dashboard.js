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
  query,
  where,
} from "../../../firebase";
import {
  FaHome,
  FaStore,
  FaClipboardList,
  FaShoppingBag,
  FaCog,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EditProfile from "../EditProfile";
import Store from "./Store";
import Home from "./Home";
import Products from "./Products";
import SellerSettings from "./SellerSettings";
import SellerOrders from "./SellerOrders";
import LoaderComponent from "../LoaderComponent";

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [storeData, setStoreData] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
          setProfileImageUrl(
            userData.profile?.profileImageUrl || "https://via.placeholder.com/150"
          );
        }
        const storesCollectionRef = collection(firestore, "stores");
        const q = query(storesCollectionRef, where("userId", "==", userUid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const storeDoc = querySnapshot.docs[0];
          setStoreData(storeDoc.data());
        }
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-orange-500 to-orange-600 text-white flex flex-col p-6">
        <div className="text-center mb-10">
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto shadow-lg mb-4"
          />
          <h2 className="text-2xl font-semibold">{userDetails?.profile?.name}</h2>
          <p className="text-sm opacity-80">{userDetails?.profile?.phoneNumber}</p>
          <p className="text-sm opacity-80">{userDetails?.profile?.email}</p>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="mt-4 flex items-center justify-center text-white bg-orange-400 rounded-lg py-2 px-4 font-medium shadow-md border border-white hover:bg-orange-500 hover:border-orange-300 transition duration-200"
          >
            Edit Profile
          </button>

        </div>

        <nav className="space-y-4">
          {[
            { label: "Home", icon: <FaHome />, tab: "Home" }, 
            { label: "Store", icon: <FaStore />, tab: "Store" },
            { label: "Orders", icon: <FaClipboardList />, tab: "Orders" },
            { label: "Products", icon: <FaShoppingBag />, tab: "Products" },
            { label: "Settings", icon: <FaCog />, tab: "SellerSettings" },
          ].map(({ label, icon, tab }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsEditingProfile(false);
              }}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${activeTab === tab
                  ? "bg-white text-orange-500 shadow-md font-bold"
                  : "hover:bg-orange-700 hover:text-white opacity-90"
                }`}
            >
              {icon} <span className="ml-3">{label}</span>
            </button>
          ))}
          <button
            onClick={() => signOut(auth)}
            className="mt-auto flex items-center py-3 px-4 rounded-lg opacity-90 hover:bg-orange-700 hover:text-white transition"
          >
            <FaSignOutAlt className="mr-3" /> Sign Out
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 bg-white rounded-tl-3xl shadow-lg">
        {isEditingProfile && <EditProfile />}
        {activeTab === "Home" && storeData && <Home storeId={storeData.storeId} />}
        {activeTab === "Store" && <Store />}
        {activeTab === "Orders" && <SellerOrders storeId={storeData.storeId} />}
        {activeTab === "Products" && <Products storeId={storeData.storeId} />}
        {activeTab === "SellerSettings" && <SellerSettings storeId={storeData.storeId} />}
      </div>
    </div>
  );
};

export default Dashboard;
