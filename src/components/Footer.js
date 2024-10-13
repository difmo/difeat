import userContext from "../utils/userContext";
import { useContext } from "react";
import { FaReact } from "react-icons/fa6";

const Footer = () => {
  const { user } = useContext(userContext);
  return (
    <h4 className="p-10 mt-4 mx-auto items-center text-center text-white bg-[#000000]">
    Copyright @2024 {user.name}
    
         {/* {" "}
       -{" "}
      <a href="mailto: info@difmo.com" className="text-[#fb0b0f]">
        {user.email}
      </a> */}
    </h4>
  );
};

export default Footer;
