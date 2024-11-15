// src/components/UserDashboard.js
import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import userContext from "../../utils/userContext";

const SellerSttings = () => {
  const { user, setUser } = useContext(userContext);
  const userId = useSelector((state) => state.auth?.user?.id);
  return (
      <h1>Seller Settings</h1>

  );
};

export default SellerSttings;
