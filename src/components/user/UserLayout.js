import React from "react";
import UserHeader from "./UserHeader"; // Import UserHeader component
import UserFooter from "./UserFooter"; // Import UserFooter component

const UserLayout = ({ children }) => {
  return (
    <div>
      <UserHeader />
      <main>{children}</main>
      <UserFooter />
    </div>
  );
};

export default UserLayout;
