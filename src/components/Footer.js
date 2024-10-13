import userContext from "../utils/userContext";
import { useContext } from "react";
import { FaReact } from "react-icons/fa6";

const Footer = () => {
  const { user } = useContext(userContext);
  return (
    <footer className="py-8 text-white bg-gray-900">
    <div className="max-w-6xl mx-auto text-center">
      <p>© {new Date().getFullYear()} DifEat Services. All rights reserved.</p>
    </div>
  </footer>
  );
};

export default Footer;
