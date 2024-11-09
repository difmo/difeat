import React from "react";
import SellerHeader from "./SellerHeader";
import { Outlet } from "react-router-dom";
import SellerFooter from "./SellerFooter";

const SellerLayout = () => (
  <div>
    <SellerHeader />
    <main><Outlet /></main>
    <SellerFooter />
  </div>
);

export default SellerLayout;
