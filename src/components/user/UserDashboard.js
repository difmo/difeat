// src/components/UserDashboard.js
import { useState, useContext } from "react";
import userContext from "../../utils/userContext";
import BecomeStoreKeeperForm from "../seller/BecomeStoreKeeperForm";
import Body from "../Body";
import Header from "../Header";
import Footer from "../Footer";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const { user, setUser } = useContext(userContext);
  const userId = useSelector((state) => state.auth?.user?.id);
  const [showForm, setShowForm] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  return (
    <div>
      {/* <Header cartItems={cartItems} /> */}
      <Body />
      {/* <Footer /> */}
    </div>

  );
};

export default UserDashboard;
