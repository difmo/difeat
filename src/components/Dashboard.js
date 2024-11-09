import React, { useContext } from "react";
import userContext from "../utils/userContext";
import SellerDashboard from "./seller/SellerDashboard";
import UserDashboard from "./user/UserDashboard";

const Dashboard = () => {
  const { user } = useContext(userContext);

  if (!user) return <p>Loading Dashboard...</p>;

  const isStoreKeeper = user?.roles?.isStoreKeeper || false;
  
  return (
    <div>
      {isStoreKeeper ? <SellerDashboard /> : <UserDashboard />}
    </div>
  );
};

export default Dashboard;
