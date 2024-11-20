import React, { useEffect, useState } from "react";
const LoaderComponent = () => {



  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700">Loading, please wait...</p>
    </div>
  );
};

export default LoaderComponent;
