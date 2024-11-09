// src/components/UserDashboard.js
import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import userContext from "../../utils/userContext";
import BecomeStoreKeeperForm from "./BecomeStoreKeeperForm";
import SellerProfile from "./SellerProfile";

const SellerDashboard = () => {
  const { user, setUser } = useContext(userContext);
  const userId = useSelector((state) => state.auth?.user?.id);
  return (
        <SellerProfile/>

  );
};

export default SellerDashboard;
