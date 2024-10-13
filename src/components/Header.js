import { useContext, useEffect, useState } from "react";
import chef from "../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useOnline from "../utils/useOnline";
import userContext from "../utils/userContext";
import { useDispatch, useSelector } from "react-redux";
import store from "../utils/store";


const Title = () => (
  <a href="/">
    <img
      className="w-[249px] h-auto"
      alt="DifEat"
      src={chef}
    />
  </a>
);


const Header = () => {
  const token = localStorage.getItem("token");
   // use useState for user logged in or logged out
   const [isLoggedin, setIsLoggedin] = useState(
    token?.length === 100 ? true : false
  );
  const navigate = useNavigate();

  const [city, setCity] = useState("");

  const isOnline = useOnline();

  const { user } = useContext(userContext);

  const cartItems = useSelector((store) => store.cart.items);
  // console.log(cartItems);

  const [ctime,setCtime] = useState(new Date().toLocaleTimeString());
  setInterval(()=>{
    setCtime(new Date().toLocaleTimeString());
  },1000)

 

  const path = useLocation();
  // console.log(path.state?.data)
  const isLogin = path.state?.data;

  useEffect(() => {
    
  },[isLogin]);

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between w-full px-2 py-1 text-[#fb0b0f] shadow bg-white lg:px-6 md:px-8">
     <div className="flex items-center gap-3 text-sm font-normal whitespace-nowrap md:gap-6 md:font-semibold md:text-lg"> <Title />
    </div>
     {/* <Timer /> */}
      <ul className="flex items-center gap-3 mr-8 text-lg font-medium lg:gap-6 md:gap-12">
        {/* <li> <input  type="text"
          className="lg:w-64 md:w-50  h-6 text-md text-black border-b-2  border-gray-900 bg-white focus:bg-[#fd9133]  transition-all duration-300 px-2 rounded"
          placeholder="your location"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
       />
       </li>
    
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-5 w-5">
        <path
          fill-rule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clip-rule="evenodd" />
      </svg> */}

      <Link to="/" className="px-1 transition-all duration-300 ease-in-out text-[#fb0b0f] hover:text-orange-900 hover:bg-gray-200 hover:rounded">
            <li>Home</li>
          </Link>
        

      <Link
          to="/about"
          className="px-1 transition-all duration-300 ease-in-out  text-[#fb0b0f] hover:text-orange-900 hover:bg-gray-200 hover:rounded"
        >
          <li>About</li>
        </Link>

      <Link
          to="/contact"
          className="px-1 transition-all duration-300 ease-in-out  text-[#fb0b0f] hover:text-orange-900 hover:bg-gray-200 hover:rounded"
        >
          <li>Contact</li>
      </Link>
      <li>
        <Link to="/cart" className="relative ">
            <i className="fa-solid fa-cart-shopping">
              <span
                className="absolute top-[-8px] right-[-12px]  text-[#fb0b0f] bg-white text-[#fb0b0f] w-4 p-1  h-4 rounded-full text-[12px] flex justify-center items-center"
                data-testid="cart"
              >
                {cartItems.length}
              </span>
            </i>
          </Link>
        </li>

        <li>
          {/* use conditional rendering for login and logout */}
            {isLoggedin ? (
              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsLoggedin(!isLoggedin);
                }}
              >
                Logout
              </button>
            ) : (
              <button className="login-btn" onClick={() => {navigate("/login", {state: {data: isLoggedin}})
              setIsLoggedin(!isLoggedin);
              }}>
                login
              </button>
            )}
        </li>
     </ul>
      {/* <ul>
        <li>{isOnline ? "✅" : "🔴"}</li>
         <li className="font-bold text-purple-900">{user.name}</li> 
      </ul>  */}
    </div>
  );
};

export default Header;
