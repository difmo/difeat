// src/App.js
import React, { lazy, Suspense ,useContext} from "react";
import { RouterProvider } from "react-router-dom";
import userContext, { UserProvider } from "./utils/userContext";
import {userRouter,sellerRouter} from "./router";
const App = () => {
  const { user } = useContext(userContext);
  console.log('gggg',user);

  const isStoreKeeper = user?.roles?.isStoreKeeper || false;
  
return (
  <UserProvider>
    <RouterProvider router={!user||!isStoreKeeper?userRouter:sellerRouter} />
  </UserProvider>
);
}
export default App;