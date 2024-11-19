import React, { useContext, useEffect, useState } from "react";
import chef from "../assets/logo.png";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useOnline from "../utils/useOnline";
import userContext from "../utils/userContext";
import { useSelector } from "react-redux";
import BottomNav from "./BottomNav";
import { auth, onAuthStateChanged, signOut, doc, firestore, getDoc } from "../../firebase";

// Logo component
const Title = () => (
  <a href="/">
    <img className="w-[249px] h-auto" alt="DifEat" src={chef} />
  </a>
);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnline();
  const { user } = useContext(userContext);
  const [userDetails, setUserDetails] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const cartItems = useSelector((store) => store.cart.items);

  // Manage login state based on token presence
  const [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
          setProfileImageUrl(userData.profile?.profileImageUrl || "");
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
        localStorage.setItem("token", user.accessToken || "user-auth-token");
        setIsLoggedin(true);
        console.log("User logged in");
      } else {
        navigate("/");
        localStorage.removeItem("token");
        setIsLoggedin(false);
        console.log("User logged out");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between w-full px-2 py-1 text-[#fb0b0f] shadow bg-white lg:px-6 md:px-8">
        <div className="flex items-center gap-3 text-sm font-normal whitespace-nowrap md:gap-6 md:font-semibold md:text-lg">
          <Title />
        </div>
        <div className="flex items-center gap-4">
          {/* Profile or Login Button for Mobile */}
          <div className="flex items-center lg:hidden">
            {isLoggedin ? (
              <Link to="/profile" className="mr-4">
                <i className="fa-solid fa-user-circle text-2xl text-[#fb0b0f]"></i>
              </Link>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="mr-4 login-btn flex items-center text-[#fb0b0f] bg-transparent border-none cursor-pointer"
              >
                <i className="fa-solid fa-user-circle text-2xl text-[#fb0b0f]"></i> Login
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <ul className="items-center hidden gap-3 mr-8 text-lg font-medium lg:flex lg:gap-6 md:gap-12">
            <Link to="/" className="px-1 transition-all duration-300 ease-in-out text-[#fb0b0f] hover:text-orange-900 hover:bg-gray-200 hover:rounded">
              <li>Home</li>
            </Link>
            <Link to="/food" className="px-1 transition-all duration-300 ease-in-out text-[#fb0b0f] hover:text-orange-900 hover:bg-gray-200 hover:rounded">
              <li>Food</li>
            </Link>
            <Link to="/water" className="px-1 transition-all duration-300 ease-in-out text-[#fb0b0f] hover:text-orange-900 hover:bg-gray-200 hover:rounded">
              <li>Water</li>
            </Link>
            <li>
              <Link to="/cart" className="relative">
                <i className="fa-solid fa-cart-shopping">
                  <span className="absolute top-[-8px] right-[-12px] text-[#fb0b0f] bg-white text-[#fb0b0f] w-4 p-1 h-4 rounded-full text-[12px] flex justify-center items-center">
                    {cartItems.length}
                  </span>
                </i>
              </Link>
            </li>
            <li>
              {isLoading ? (
                "Loading..."
              ) : isLoggedin ? (
                <button
                  onClick={() =>
                    userDetails?.roles?.isStoreKeeper
                      ? navigate("/")
                      : navigate("/profile")
                  }
                  className="logout-btn"
                >
                  {userDetails?.profile?.name
                    ?? userDetails?.profile?.phoneNumber
                    ?? "Guest"}
                </button>
              ) : (
                <button onClick={() => navigate("/login")} className="login-btn">
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Header;
