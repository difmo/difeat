import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BottomNav = () => {
  const cartItems = useSelector((store) => store.cart.items); // Get cart items from the Redux store

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around p-2 bg-white shadow-lg lg:hidden">
      <Link to="/" className="flex flex-col items-center text-[#fb0b0f]">
        <i className="fa-solid fa-house-user"></i>
        <span>Home</span>
      </Link>
      {/* Commented out About and Contact links for future use
      <Link to="/about" className="flex flex-col items-center text-[#fb0b0f]">
        <i className="fa-solid fa-info-circle"></i>
        <span>About</span>
      </Link>
      <Link to="/contact" className="flex flex-col items-center text-[#fb0b0f]">
        <i className="fa-solid fa-envelope"></i>
        <span>Contact</span>
      </Link>
      */}
      <Link to="/food" className="flex flex-col items-center text-[#fb0b0f]">
        <i className="fa-solid fa-utensils"></i>
        <span>Food</span>
      </Link>
      <Link to="/water" className="flex flex-col items-center text-[#fb0b0f]">
        <i className="fa-solid fa-glass-water"></i>
        <span>Water</span>
      </Link>
      <Link to="/cart" className="flex flex-col items-center text-[#fb0b0f] relative">
        <i className="fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
        {cartItems.length > 0 && ( // Only show count if there are items in the cart
          <span className="absolute top-[-8px] right-[-12px] text-[#fb0b0f] bg-white text-[#fb0b0f] w-4 h-4 rounded-full flex justify-center items-center text-xs">
            {cartItems.length}
          </span>
        )}
      </Link>
    </div>
  );
};

export default BottomNav;
