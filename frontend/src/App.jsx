import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/global/Navbar";
import "./app.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import PackagePage from "./pages/PackagePage";
import ContactPage from "./pages/ContactPage";
import SinglePackage from "./components/package/SinglePackage";
import Checkout from "./components/package/Checkout";
import Finished from "./components/package/Finished";
import ProtectedRoute from "./utils/ProtectedRoute"; // Import ProtectedRoute
import IsAdmin from "./utils/IsAdmin";
import Error401 from "./pages/Error401";
import AdminMain from "./pages/Admin/AdminMain";
import Dashboard from "./components/admin/Dashboard";
import Test from "./pages/Admin/Test";
import UserTable from "./components/admin/UserTable";
import Booking from "./components/booking/Booking";
import Main from "./components/booking/Main";
import Booked from "./components/booking/Booked";
import Canceled from "./components/booking/Canceled";
import Sidebar from "./components/booking/Sidebar";

const App = () => {
  const Layout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  };
  const BookingLayout = () => {
    return (
      <>
        <Main />
      </>
    );
  };


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />
        },
        {
          path: "/about",
          element: <AboutPage />
        },
        {
          path: "/packages",
          element: <PackagePage />
        },
        {
          path: "/contact",
          element: <ContactPage />
        },
        {
          path: "/",
          element: <BookingLayout />,
          children: [
            { path: "booking", element: <Booking /> }, // Default /booking
            { path: "booked", element: <Booked /> }, // /booking/booked
            { path: "canceled", element: <Canceled /> }, // /booking/canceled
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />

    },
    {
      path: "/401-Error-Unauthorized",
      element: <Error401 />

    },
    {
      path: "/signup",
      element: <SignupPage />
    },
    {
      path: "packages/our-package/:pid",
      element: <SinglePackage />

    },

    // ✅ Wrap protected routes inside `ProtectedRoute`
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "package/checkout/:pid/:date",
          element: <Checkout />

        },
        {
          path: "finished/:pid",
          element: <Finished />

        },
      ],
    },
    {
      element: <IsAdmin />,
      children: [
        {
          path: "admin/dashboard",
          element: <AdminMain />,
          children: [
            {
              path: "/admin/dashboard/",
              element: <Dashboard />
            },
            {
              path: "/admin/dashboard/user",
              element: <UserTable />
            },
          ]
        }
      ]
    }
  ]);

  return (
    <div className="App font-heading">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
