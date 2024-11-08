import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { auth, signOut } from "../../firebase";

const Settings = () => {
  const handleSignOut = () => {
    signOut(auth).then(() => {
      window.location.reload();
    }).catch(error => console.error("Error signing out:", error));
  };

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold mb-2">Settings</h3>
      <button onClick={handleSignOut} className="text-red-500 flex items-center">
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </div>
  );
};

export default Settings;
