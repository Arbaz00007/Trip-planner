import React, { useContext, useState } from "react";
import "./style.css";
import { NavLink, Link } from "react-router-dom";
import Logo from "../../image/img/logo4.png";
import { RxDashboard } from "react-icons/rx";
import { IoIosHome, IoIosBulb } from "react-icons/io";
import { FaEnvelope } from "react-icons/fa";
import { BiSolidPackage } from "react-icons/bi";
import { AiOutlineDown } from "react-icons/ai";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { AuthContext } from "../../context/authContext";
import { FaBookmark } from "react-icons/fa";
import { post } from "../../utils/api";
import { IoChatboxEllipses } from "react-icons/io5";

export default function Navbar() {
  const { currentUser, logout, fetchMessage } = useContext(AuthContext);
  // console.log(currentUser?.name);
  const [isLogoutDiv, setIsLogoutDiv] = useState(false);

  const handleLogout = async () => {
    setIsLogoutDiv(false);
    logout();
    console.log(fetchMessage);

    // alert(res.message);
  };
  return (
    <div className="z-10">
      <nav id="navBar">
        <div className="logo">
          <div className="nav_logo">
            <NavLink to="/" className="nav_links">
              <img src={Logo} alt="Logo" />
            </NavLink>
          </div>
        </div>
        <div className="links links_container">
          <ul>
            <li>
              <NavLink to="/" className="nav_links">
                <IoIosHome /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="nav_links">
                <IoIosBulb /> About
              </NavLink>
            </li>
            <li>
              <NavLink to="/packages" className="nav_links">
                <BiSolidPackage /> Package
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="nav_links">
                <FaEnvelope /> Contact
              </NavLink>
            </li>
            {currentUser?.role_id === 1 && (
              <li>
                <NavLink to="/admin/dashboard" className="nav_links">
                  <RxDashboard className="dash" /> Dashboard
                </NavLink>
              </li>
            )}
            {currentUser?.role_id === 2 && (
              <li>
                <NavLink to="/guider/dashboard" className="nav_links">
                  <RxDashboard className="dash" /> Dashboard
                </NavLink>
              </li>
            )}
            {currentUser?.role_id === 3 && (
              <>
                <li>
                  <NavLink to="/booking" className="nav_links">
                    <FaBookmark className="dash" /> Booking
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/chat" className="nav_links">
                    <IoChatboxEllipses className="dash" /> Chat
                  </NavLink>
                </li>
              </>
            )}
            {currentUser ? (
              currentUser.role_id === 1 ? (
                <div
                  onClick={() => setIsLogoutDiv(!isLogoutDiv)}
                  className="cursor-pointer flex bg-primary text-white rounded-md p-4"
                >
                  Admin
                </div>
              ) : currentUser.role_id === 2 ? (
                <div
                  onClick={() => setIsLogoutDiv(!isLogoutDiv)}
                  className="cursor-pointer flex bg-primary text-white rounded-md p-4"
                >
                  Guider
                </div>
              ) : (
                <div
                  onClick={() => setIsLogoutDiv(!isLogoutDiv)}
                  className="transition-transform userName text-white flex justify-center items-center gap-[0.1rem] font-extrabold bg-primary"
                >
                  <span className="uppercase text-xl">
                    {currentUser?.name.charAt(0)}
                  </span>
                  <AiOutlineDown />
                </div>
              )
            ) : (
              <Link to="/login">
                <button className="login btn p-2 px-4 rounded-md">Login</button>
              </Link>
            )}
          </ul>
        </div>
      </nav>
      {isLogoutDiv && (
        <div className="logoutDiv z-10">
          <div className="name">
            <h5 className="font-extrabold">{currentUser?.name}</h5>
          </div>
          <div className="setting">
            <h5>
              <AiFillSetting /> Setting
            </h5>
          </div>
          <div onClick={handleLogout} className="logout">
            <h5>
              <AiOutlineLogout className="logoutIcon" /> Logout
            </h5>
          </div>
        </div>
      )}
      {/* <div className='modalBackground'>
                <div className="modalContainer">
                    <img src={Logo} alt="Logo" />
                    <button className="modalCloseBtn">
                        <AiOutlineClose style={{ fontWeight: "bolder" }} />
                    </button>
                    <div className="modalBody">
                        <h3>Are you sure you want to logout?</h3>
                    </div>
                    <div className="modalFooter">
                        <button>Logout</button>
                    </div>
                </div>
            </div> */}
    </div>
  );
}
