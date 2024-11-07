import React, { lazy, Suspense, useState, useContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Provider, useSelector } from "react-redux"; // Import Provider from react-redux

import Header from "./components/Header";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Error from "./components/Error";
import Shimmer from "./components/Shimmer";
import RestaurantMenu from "./components/RestaurantMenu";
import Profile from "./components/Profile";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Food from "./components/Food";
import Water from "./components/Water";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import CancellationRefundPolicy from "./components/CancellationRefundPolicy";

import userContext from "./utils/userContext";
import store from "./utils/store";

// Lazy-loaded components
const Contact = lazy(() => import("./components/Contact"));
const About = lazy(() => import("./components/About"));

// Main Layout Component
const AppLayout = () => {
  const [user, setUser] = useState(null); // Manage the user state here
  const cartItems = useSelector((state) => state.cart.items); // Access cart items from Redux state
  
  return (
    <userContext.Provider value={{ user, setUser }}>
      <Header cartItems={cartItems} />
      <Outlet />
      <Footer />
    </userContext.Provider>
  );
};

// Router Configuration
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/about",
        element: (
          <Suspense fallback={<h1 className="items-center p-4">Loading....</h1>}>
            <About />
          </Suspense>
        ),
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
        ],
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
        path: "/",
        element: <Body user={{ name: "Difeat Services", email: "difeatservices@gmail.com" }} />,
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
    ],
  },
]);

// Render the app inside the Redux Provider
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}> {/* Wrap the entire app with the Provider */}
    <RouterProvider router={appRouter} />
  </Provider>
);
