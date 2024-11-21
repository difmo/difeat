import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BottomNav = () => {
  const cartItems = useSelector((store) => store.cart.items);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around py-3 bg-white shadow-md border-t border-gray-200 z-50 lg:hidden">
      {/* Home Link */}
      <Link
        to="/"
        className="flex flex-col items-center text-gray-600 hover:text-[#fb0b0f] transition duration-300 ease-in-out"
      >
        <i className="fa-solid fa-house-user text-xl"></i>
        <span className="text-xs mt-1">Home</span>
      </Link>

      {/* Food Link */}
      <Link
        to="/food"
        className="flex flex-col items-center text-gray-600 hover:text-[#fb0b0f] transition duration-300 ease-in-out"
      >
        <i className="fa-solid fa-utensils text-xl"></i>
        <span className="text-xs mt-1">Food</span>
      </Link>

      {/* Water Link */}
      <Link
        to="/water"
        className="flex flex-col items-center text-gray-600 hover:text-[#fb0b0f] transition duration-300 ease-in-out"
      >
        <i className="fa-solid fa-glass-water text-xl"></i>
        <span className="text-xs mt-1">Water</span>
      </Link>

      {/* Cart Link */}
      <Link
        to="/cart"
        className="flex flex-col items-center text-gray-600 hover:text-[#fb0b0f] transition duration-300 ease-in-out relative"
      >
        <i className="fa-solid fa-cart-shopping text-xl"></i>
        <span className="text-xs mt-1">Cart</span>
        {cartItems.length > 0 && (
          <span className="absolute top--15 bottom-8 right--0 left-3  text-white bg-[#fb0b0f] w-5 h-5 rounded-full flex justify-center items-center text-[10px] font-bold shadow-md">
            {cartItems.length}
          </span>
        )}
      </Link>
    </div>
  );
};

export default BottomNav;
