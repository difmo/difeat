// src/components/AppLayout.js
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import userContext from "../utils/userContext";
import Header from "./Header";
import Footer from "./Footer";
import Dashboard from "./Dashboard";
import { useSelector } from "react-redux";

const AppLayout = ({ children }) => {
  const { user } = useContext(userContext);
  const cartItems = useSelector((state) => state.cart.items);
  return (
    <div>
      <Header cartItems={cartItems} />
      {children}
      <Outlet />
      <Footer />
    </div>
  );
};

export default AppLayout;
