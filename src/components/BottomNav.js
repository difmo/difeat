import { Link } from "react-router-dom";

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around p-2 bg-white shadow-lg lg:hidden">
      <Link to="/" className="flex flex-col items-center text-[#fb0b0f]">
        <i className="fa-solid fa-house-user"></i>
        <span>Home</span>
      </Link>
      <Link to="/about" className="flex flex-col items-center text-[#fb0b0f]">
        <i className="fa-solid fa-info-circle"></i>
        <span>About</span>
      </Link>
      <Link to="/contact" className="flex flex-col items-center text-[#fb0b0f]">
        <i className="fa-solid fa-envelope"></i>
        <span>Contact</span>
      </Link>
      <Link to="/cart" className="flex flex-col items-center text-[#fb0b0f]">
        <i className="fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
      </Link>
    </div>
  );
};

export default BottomNav;
