import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Ensure this path is correct for your logo file

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between space-y-8 lg:space-y-0">
          
          {/* Logo and Description */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/3 space-y-4">
            <img src={logo} alt="Difeat Logo" className="h-16" />
            <p className="text-sm lg:text-base">
            Bringing Convenience and Quality to Your Doorstep
            </p>
          </div>

          {/* Useful Links */}
          <div className="text-center lg:text-left lg:w-1/3 space-y-2">
            <h3 className="font-semibold text-lg">USEFUL LINKS</h3>
            <div className="flex flex-col items-center lg:items-start space-y-2">
              <Link to="/about" className="hover:text-gray-400">About Us</Link>
              <Link to="/contact" className="hover:text-gray-400">Contact Us</Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center lg:text-left lg:w-1/3 space-y-2">
            <h3 className="font-semibold text-lg">CONTACT</h3>
            <p>Email: <a href="mailto:difeatservices@gmail.com" className="hover:text-gray-400">difeatservices@gmail.com</a></p>
            <p>Phone: <a href="tel:+919455791624" className="hover:text-gray-400">+91 945-579-1624</a></p>
            <p>Address: 4/37 Vibhav Khand, Gomti Nagar, Lucknow, Uttar Pradesh, 226010</p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} DIFEAT SERVICES. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link>
            <span>|</span>
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <span>|</span>
            <Link to="/refund-policy" className="hover:text-white">Cancellation & Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
