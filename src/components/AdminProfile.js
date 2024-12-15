import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Orders from "./Orders";
import Addresses from "./Addresses";
import EditProfile from "./EditProfile";
import LoaderComponent from "./LoaderComponent";
import { auth, onAuthStateChanged, firestore, signOut, doc, getDoc, collection, getDocs } from "../../firebase";
import Settings from "./Settings";

const AdminProfile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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

  if (isLoading) {
    return <LoaderComponent />;
  }

  const menuItems = [
    { text: "Orders", icon: "📦" },
    { text: "Addresses", icon: "🏠" },
    { text: "Edit Profile", icon: "✏️" },
    { text: "Settings", icon: "⚙️" },
    { text: "Sign Out", icon: "🚪" },
  ];

  // const handleSignOut = () => {
  //   signOut(auth)
  //     .then(() => {
  //       navigate("/login"); // Redirect to login after signout
  //     })
  //     .catch((error) => {
  //       console.error("Error during sign out:", error);
  //     });
  // };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login after signout
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case "Orders":
        return <Orders orders={orders} />;
      case "Addresses":
        return <Addresses addresses={addresses} />;
      case "Edit Profile":
        return <EditProfile userDetails={userDetails} />;
      case "Settings":
        return <Settings />;
      default:
        return <div>Select a menu item.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 md:z-0 min-h-screen bg-[#fc8019] text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform w-64`}
      >
        <div className="p-6 text-center">
          <img
            src={userDetails?.profile?.profileImageUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-md"
          />
          <h2 className="text-2xl font-bold">{userDetails?.profile?.name}</h2>
          <p className="text-sm opacity-80 mt-1">{userDetails?.profile?.email}</p>
        </div>
        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`flex text-xl font-semibold items-center p-4 hover:bg-[#fd790d] text-white cursor-pointer ${
                  activeTab === item.text ? "bg-[#fd790d] text-white" : ""
                }`}
                onClick={() => {
                  if (item.text === "Sign Out") {
                    handleSignOut(); // Sign out if Sign Out item is clicked
                  } else {
                    setActiveTab(item.text); // Update the active tab otherwise
                  }
                  setSidebarOpen(false);
                }}
              >
                <span className="mr-4 text-xl">{item.icon}</span>
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
      <main className="flex-1 p-6 ml-0 md:ml-6 transition-all">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-3xl font-bold">{activeTab}</h1>
        </header>

        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminProfile;
