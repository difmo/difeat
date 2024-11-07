import React, { lazy, Suspense, useState, useContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Provider } from "react-redux";

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
  const [user, setUser] = useState({
    name: "Difmo Technologies",
    email: "info@difmo.com",
  });

  return (
    <Provider store={store}>
      <userContext.Provider value={{ user, setUser }}>
        <Header />
        <Outlet />
        <Footer />
      </userContext.Provider>
    </Provider>
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
        element: <Body user={{ name: "Difmo Technologies", email: "info@difmo.com" }} />,
      },
      {
        path: "/food",
        element: <Food user={{ name: "Difmo Technologies", email: "info@difmo.com" }} />,
      },
      {
        path: "/water",
        element: <Water user={{ name: "Difmo Technologies", email: "info@difmo.com" }} />,
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

// Render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
