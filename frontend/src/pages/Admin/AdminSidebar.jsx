import React, { useState } from "react";
import "./style.css";
import { BiSolidPackage } from "react-icons/bi";
import { FaTag, FaShoppingCart, FaLaptop, FaBookMedical } from "react-icons/fa";
import { TbDeviceAirpodsCase, TbDeviceIpad } from "react-icons/tb";
import { CgAppleWatch } from "react-icons/cg";
import { GrTransaction } from "react-icons/gr";

import { MdDashboard, MdPhoneIphone } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaBox, FaUser } from "react-icons/fa6";

const AdminSidebar = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showCategories, setShowCategories] = useState(false); // To toggle categories

  const handleClick = (section) => {
    setActiveSection(section);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories); // Toggle category dropdown
  };

  return (
    <aside className="h-full w-full bg-[#1C2434] sticky top-0 z-999">
      {/* Admin Heading */}
      <div className="grid place-items-center">
        <h1
          style={{ fontFamily: "Rubik Maps" }}
          className="text-5xl cursor-pointer mt-[0.8rem]  text-[#c8c8c8]"
        >
          TravelMate
        </h1>
        <h1 className="text-2xl text-white">Admin</h1>
      </div>

      {/* Sidebar Links */}
      <div className="mt-12">
        <Link to="/admin/dashboard">
          <div
            onClick={() => handleClick("dashboard")}
            className="flex gap-2 items-center p-4 text-white cursor-pointer"
          >
            <MdDashboard /> Dashboard
          </div>
        </Link>

        <ul className="my-ul p-4 flex flex-col gap-2 border-t-2 border-b-2">
          {/* All Users Section */}
          <Link to="/admin/dashboard/packages">
            <li
              onClick={() => handleClick("myProducts")}
              className={`${activeSection === "myProducts" ? "my-class" : ""}`}
            >
              {" "}
              <BiSolidPackage /> All Packages
            </li>
          </Link>
          <Link to="/admin/dashboard/user">
            <li
              onClick={() => handleClick("myUser")}
              className={`flex items-center gap-2 p-2 cursor-pointer ${
                activeSection === "myUser" ? "my-class" : ""
              }`}
            >
              <FaUser /> All Users
            </li>
          </Link>
          <Link to="/admin/dashboard/booking">
            <li
              onClick={() => handleClick("myBooking")}
              className={`flex items-center gap-2 p-2 cursor-pointer ${
                activeSection === "myBooking" ? "my-class" : ""
              }`}
            >
              <FaBookMedical /> Booking
            </li>
          </Link>

          {/* All Products with Dropdown Categories */}
          {/* <li
            onClick={toggleCategories}
            className={`flex items-center gap-2 p-2 cursor-pointer ${activeSection === "mySale" ? "my-class" : ""
              }`}
          >
            <FaBox /> All Products
          </li> */}

          {/* Dropdown Categories - Slide Down */}
          {/* {showCategories && (
            <ul className="ml-6 mt-2">
              <Link to={"/admin/dashboard/iphone"}>
                <li className="text-white p-2 cursor-pointer">
                  <MdPhoneIphone />
                  iPhone
                </li>
              </Link>
              <Link to={"/admin/dashboard/ipad"}>
                <li className="text-white p-2 cursor-pointer">
                  <TbDeviceIpad />
                  iPad
                </li>
              </Link>
              <Link to={"/admin/dashboard/airpod"}>
                <li className="text-white p-2 cursor-pointer">
                  <TbDeviceAirpodsCase />
                  AirPods
                </li>
              </Link>
              <Link to={"/admin/dashboard/watch"}>
                <li className="text-white p-2 cursor-pointer">
                  <CgAppleWatch />
                  Watch
                </li>
              </Link>
              <Link to={"/admin/dashboard/mackbook"}>
                <li className="text-white p-2 cursor-pointer">
                  <FaLaptop />
                  Mackbook
                </li>
              </Link>
            </ul>
          )} */}

          {/* My Purchase Section */}
          <Link to="/admin/dashboard/transaction">
            <li
              onClick={() => handleClick("myPurchase")}
              className={`flex items-center gap-2 p-2 cursor-pointer ${
                activeSection === "myPurchase" ? "my-class" : ""
              }`}
            >
              <GrTransaction />
              Transaction
            </li>
          </Link>
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
