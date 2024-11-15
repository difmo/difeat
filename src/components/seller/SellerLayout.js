import React from "react";
import SellerHeader from "./SellerHeader";
import { Outlet } from "react-router-dom";
import SellerFooter from "./SellerFooter";

const SellerLayout = ({children}) => (
  <div>
    <SellerHeader />
    {children}
    <Outlet />
    <SellerFooter />
  </div>
);

export default SellerLayout;
