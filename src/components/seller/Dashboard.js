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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
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
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/login");  // Redirect to the login page
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  // const handleSignOut2 = async () => {
  //   setIsSigningOut(true); // Show loader or disable buttons
  //   try {
  //     await signOut(auth); // Sign out the user
  //     navigate("/login"); // Redirect to the login page
  //   } catch (error) {
  //     console.error("Error during sign-out:", error);
  //     alert("Failed to sign out. Please try again."); // Notify user of error
  //   } finally {
  //     setIsSigningOut(false); // Reset loading state
  //   }
  // };

  const menuItems = [
    { text: "Home", icon: <FaHome />, onClick: () => setActiveTab("Home") },
    { text: "Edit Profile", icon: <FaUserEdit />, onClick: () => setActiveTab("Edit Profile") },
    { text: "Store", icon: <FaStore />, onClick: () => setActiveTab("Store") },
    { text: "Orders", icon: <FaClipboardList />, onClick: () => setActiveTab("Orders") },
    { text: "Products", icon: <FaShoppingBag />, onClick: () => setActiveTab("Products") },
    { text: "Settings", icon: <FaCog />, onClick: () => setActiveTab("SellerSettings") },
    {
      text: isSigningOut ? "Signing Out..." : "Sign Out",
      icon: <FaSignOutAlt />,
      onClick: handleSignOut,
      disabled: isSigningOut, // Disable the button if signing out
    },
  ];


  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50  min-h-screen bg-[#fc8019] text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform w-64`}
      >
        <div className="p-6 text-2xl font-bold flex justify-between items-center">
          Admin Panel
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
        </div>
        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="flex  text-xl font-semibold items-center p-4 hover:bg-[#ee720d] cursor-pointer"
                onClick={item.onClick}
              >
                <span className="mr-4 text-lg">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 ml-0 md:ml-0 transition-all">
        <header className="flex justify-between items-center mb-6">
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {/* <button
            className="bg-[#bd5b0b] text-white px-4 py-2 rounded hover:bg-[#fd790d]"
            // onClick={async () => {
            //   await signOut(auth);
            //   navigate("/login");
            // }}
            onClick={handleSignOut}
          >
            Logout 
          </button> */}
        </header>

        {/* Active Tab Content */}
        <div>
          {activeTab === "Home" && storeData && <Home storeId={storeData.storeId} />}
          {activeTab === "Edit Profile" && <EditProfile />}
          {activeTab === "Store" && <Store />}
          {activeTab === "Orders" && <SellerOrders storeId={storeData.storeId} />}
          {activeTab === "Products" && <Products storeId={storeData.storeId} />}
          {activeTab === "SellerSettings" && <SellerSettings storeId={storeData.storeId} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


 