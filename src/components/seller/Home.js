// src/components/UserDashboard.js
import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import userContext from "../../utils/userContext";

const Home = () => {
  const { user, setUser } = useContext(userContext);
  const userId = useSelector((state) => state.auth?.user?.id);
  return (
      <h1>Seller Dashboard</h1>

  );
};

export default Home;
