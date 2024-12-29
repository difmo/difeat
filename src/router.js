// src/router.js
import AppLayout from "./components/AppLayout";
import Profile from "./components/Profile";
import React, { lazy, Suspense, useState, useContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Provider, useSelector } from "react-redux"; // Import Provider from react-redux

import Body from "./components/Body";
import Error from "./components/Error";
import Shimmer from "./components/Shimmer";
import RestaurantMenu from "./components/RestaurantMenu";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Food from "./components/Food";
import Water from "./components/Water";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import CancellationRefundPolicy from "./components/CancellationRefundPolicy";
import About from "./components/About";
import Contact from "./components/Contact";

import EditStore from "./components/seller/EditStore";
import SellerLayout from "./components/SellerLayout";
import Dashboard from "./components/seller/Dashboard";
import AdminProfile from "./components/AdminProfile";
import ScrollToTop from "./components/ScrollToTop";


// Router Configuration
const userRouter = createBrowserRouter([
  {
    path: "/",
    element:  <AppLayout>
        <ScrollToTop />
     
      </AppLayout>,
    errorElement: <Error />,
    children: [
      {
        path: "/about",
        element: (
          <Suspense fallback={<h1 className="items-center p-4">Loading....</h1>}>
            <About />
          </Suspense>
        )
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<Shimmer />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/refund-policy",
        element: <CancellationRefundPolicy />,
      },
      {
        path: "/edit-store/:storeId",
        element: <EditStore />,
      },
      {
        path: "/food",
        element: <Food user={{ name: "Difeat Services", email: "difeatservices@gmail.com" }} />,
      },
      {
        path: "/water",
        element: <Water user={{ name: "Difeat Services", email: "difeatservices@gmail.com" }} />,
      },
      {
        path: "/restaurant/:resId",
        element: <RestaurantMenu />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        // element: <Profile />,
        element: <AdminProfile />,
      },
      {
        path: "/",
        element: <Body/>,
      },
    ],
  },
]);

const sellerRouter = createBrowserRouter([
  {
    path: "/",
    element: <SellerLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/about",
        element: (
          <Suspense fallback={<h1 className="items-center p-4">Loading....</h1>}>
            <About />
          </Suspense>
        )
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<Shimmer />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/refund-policy",
        element: <CancellationRefundPolicy />,
      },
     
      {
        path: "/edit-store/:storeId",
        element: <EditStore />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
]);


export  { userRouter ,sellerRouter};
