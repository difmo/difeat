import React, { lazy, Suspense, useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Error from "./components/Error";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import RestaurantMenu from "./components/RestaurantMenu";
import RestrauntCard from "./components/RestaurantCard";
import Profile from "./components/Profile";
import Shimmer from "./components/Shimmer";
import { useContext } from "react";
import userContext from "./utils/userContext";
import store from "./utils/store";
import { Provider } from "react-redux";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Food from "./components/Food";
import Water from "./components/Water";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";

const Contact = lazy(() => import("./components/Contact"));
const About = lazy(() => import("./components/About"));


const AppLayout = () => {
  
  const [user, setUser] = useState({
    name: "Difmo Technologies",
    email: "info@difmo.com",
  });

  return (
    <>
      <Provider store={store}>
        <userContext.Provider value={{ user: user, setUser: setUser }}>
          <Header />
          <Outlet />
          <Footer />
        </userContext.Provider>
      </Provider>
    </>
  );
};
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/about", // parentPath/{path} => localhost:1244/about
        element: (
          <Suspense
            fallback={<h1 className="items-center p-4">Loading....</h1>}
          >
            <About />
          </Suspense>
        ),
        children: [
          {
            path: "profile", // parentPath/{path} => localhost:1244/about/profile
            element: <Profile />,
          },
        ],
      },
      {
        path: "/",
        element: (
          <Body
            user={{
              name: "Difmo Technologies",
              email: "info@difmo.com",
            }}
          />
        ),
      },
      {
        path: "/food",
        element: (
          <Food
            user={{
              name: "Difmo Technologies",
              email: "info@difmo.com",
            }}
          />
        ),
      },
      {
        path: "/water",
        element: (
          <Water
            user={{
              name: "Difmo Technologies",
              email: "info@difmo.com",
            }}
          />
        ),
      },
      {
        path: "/restaurant/:resId",
        element: <RestaurantMenu />,
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<Shimmer />}>
            <Contact/>
          </Suspense>
        ),
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/terms",
        element: <TermsAndConditions />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);
