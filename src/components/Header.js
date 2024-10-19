import React, { useContext, useEffect, useState } from "react";
import chef from "../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useOnline from "../utils/useOnline";
import userContext from "../utils/userContext";
import { useDispatch, useSelector } from "react-redux";
import BottomNav from "./BottomNav";


const Title = () => (
  <a href="/">
    <img className="w-[249px] h-auto" alt="DifEat" src={chef} />
  </a>
);

const Header = () => {
  const token = localStorage.getItem("token");
  const [isLoggedin, setIsLoggedin] = useState(token?.length === 100);
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const isOnline = useOnline();
  const { user } = useContext(userContext);
  const cartItems = useSelector((store) => store.cart.items);
  const [ctime, setCtime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCtime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const path = useLocation();
  const isLogin = path.state?.data;

  useEffect(() => {}, [isLogin]);

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center justify-between w-full px-2 py-1 text-[#fb0b0f] shadow bg-white lg:px-6 md:px-8">
        <div className="flex items-center gap-3 text-sm font-normal whitespace-nowrap md:gap-6 md:font-semibold md:text-lg">
          <Title />
        </div>
        <ul className="items-center hidden gap-3 mr-8 text-lg font-medium lg:flex lg:gap-6 md:gap-12">
          <Link to="/" className="px-1 transition-all duration-300 ease-in-out text-[#fb0b0f] hover:text-orange-900 hover:bg-gray-200 hover:rounded">
            <li>Home</li>
          </Link>
          <Link to="/about" className="px-1 transition-all duration-300 ease-in-out text-[#fb0b0f] hover:text-orange-900 hover:bg-gray-200 hover:rounded">
            <li>About</li>
          </Link>
          <Link to="/contact" className="px-1 transition-all duration-300 ease-in-out text-[#fb0b0f] hover:text-orange-900 hover:bg-gray-200 hover:rounded">
            <li>Contact</li>
          </Link>
          <li>
            <Link to="/cart" className="relative ">
              <i className="fa-solid fa-cart-shopping">
                <span className="absolute top-[-8px] right-[-12px] text-[#fb0b0f] bg-white text-[#fb0b0f] w-4 p-1 h-4 rounded-full text-[12px] flex justify-center items-center" data-testid="cart">
                  {cartItems.length}
                </span>
              </i>
            </Link>
          </li>
          <li>
            {isLoggedin ? (
              <button className="logout-btn" onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedin(!isLoggedin);
              }}>
                Logout
              </button>
            ) : (
              <button className="login-btn" onClick={() => {
                navigate("/login", { state: { data: isLoggedin } });
                setIsLoggedin(!isLoggedin);
              }}>
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
      <BottomNav /> {/* Include the BottomNav component */}
    </>
  );
};

export default Header;
