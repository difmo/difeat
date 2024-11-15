// src/components/AppLayout.js
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import userContext from "../utils/userContext";
import { useSelector } from "react-redux";

const SellerLayout = ({ children }) => {
  const { user } = useContext(userContext);
  const cartItems = useSelector((state) => state.cart.items);
  return (
    <div>
      {children}
      <Outlet />
    </div>
  );
};

export default SellerLayout;
