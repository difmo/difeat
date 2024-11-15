import React, { useEffect, useState } from "react";
import {
  auth, onAuthStateChanged, firestore, storage, signOut, PhoneAuthProvider, RecaptchaVerifier,
  signInWithCredential, doc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc,
  ref, uploadBytes, getDownloadURL,query, where,
} from "../../../firebase";
import {   FaSignOutAlt, FaBox, FaMapMarkerAlt, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Orders from "../Orders";
import Addresses from "../Addresses";
import Settings from "../Settings";
import EditProfile from "../EditProfile";
import Store from "./Store";
import Home from "./Home";
import Products from "./Products";
import SellerSttings from "./SellerSettings";
const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ displayName: "", email: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [storeData, setStoreData] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
          setEditFormData({ displayName: userData.displayName, email: userData.email });
          setProfileImageUrl(userData.profileImageUrl || ""); // Set image URL if available
        }
  
        const ordersCollectionRef = collection(firestore, "difeatusers", userUid, "orders");
        const ordersSnapshot = await getDocs(ordersCollectionRef);
        setOrders(ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        const addressesCollectionRef = collection(firestore, "difeatusers", userUid, "addresses");
        const addressesSnapshot = await getDocs(addressesCollectionRef);
        setAddresses(addressesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        console.log("currentUserID :", userUid);

        // Reference the collection, then use a query
        const storesCollectionRef = collection(firestore, "stores");
        const q = query(storesCollectionRef, where("userId", "==", userUid));
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Assuming there’s only one store per user
          const storeDoc = querySnapshot.docs[0];
          setStoreData(storeDoc.data());
          console.log('Store data:', storeDoc.data());
        } else {
          console.log("No store found for this user.");
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

  // if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-grey-100">
      {/* Sidebar */}
      <div className=" bg-blue-800 text-white p-6 flex flex-col">
        <div className="mb-8">
          <img
            src={profileImageUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold">{userDetails?.displayName} <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="mt-4 text-blue-500 flex items-center">
          Edit Profile
          </button></h2>
          <p className="text-sm opacity-80 mt-1">{userDetails?.phoneNumber} · {userDetails?.email}</p>
        </div>

        <div>
         
         
        </div>

        <nav className="flex flex-col space-y-4">

          <button onClick={() => {
            setActiveTab("Home");
            setIsEditingProfile(false);
          }} className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold">
            <FaBox className="mr-3" /> Home
          </button>
          <button onClick={() => {
            setActiveTab("Store");
            setIsEditingProfile(false);
          }} className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold">
            <FaBox className="mr-3" /> Store
          </button>

          <button onClick={() => {
            setActiveTab("Orders");
            setIsEditingProfile(false);
          }} className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold">
            <FaBox className="mr-3" /> Orders
          </button>

          <button onClick={() => setActiveTab("Products")} className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold">
            <FaMapMarkerAlt className="mr-3" /> Products
          </button>
          <button onClick={() => setActiveTab("SellerSttings")} className="flex items-center text-white opacity-100 font-semibold">
            <FaCog className="mr-3" /> Settings
          </button>
          <button onClick={() => signOut(auth)} className="flex items-center text-white opacity-90 hover:opacity-100 hover:font-semibold mt-auto">
            <FaSignOutAlt className="mr-3" /> Sign Out
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8">
        
        {isEditingProfile &&( <EditProfile />)}
        {activeTab === "Home" && <Home />}
        {activeTab === "Store" && <Store />}
        {activeTab === "Profile" && <Orders />}
        {activeTab === "Orders" && <Orders />}
        {activeTab === "Products" && <Products storeId={storeData.storeId} userId={storeData.userId}/>}
        {activeTab === "SellerSttings" && <SellerSttings storeId={storeData.storeId} />}
      </div>
    </div>
  );
};

export default Dashboard;