import React, { useContext, useEffect, useState } from "react";
import "./style.css";
import { NavLink, Link } from "react-router-dom";
import Logo from "../../image/img/logo4.png";
import { RxDashboard } from "react-icons/rx";
import { IoIosHome, IoIosBulb, IoIosNotifications } from "react-icons/io";
import { FaEnvelope } from "react-icons/fa";
import { BiSolidPackage } from "react-icons/bi";
import { AiOutlineDown } from "react-icons/ai";
import { AiFillSetting, AiOutlineClose } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";
import { AuthContext } from "../../context/authContext";
import { FaBookmark } from "react-icons/fa";
import { get, post } from "../../utils/api";
import { IoChatboxEllipses } from "react-icons/io5";
import { BsBellFill, BsCalendarCheck } from "react-icons/bs";
import {
  MdNotificationsActive,
  MdNotificationsNone,
  MdMessage,
} from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { io } from "socket.io-client";
const socket = io("http://localhost:5555");

export default function Navbar() {
  const { currentUser, logout, fetchMessage } = useContext(AuthContext);
  // console.log(currentUser?.name);
  const [isLogoutDiv, setIsLogoutDiv] = useState(false);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchApi = async () => {
      try {
        // Fetch stored notifications from MySQL
        const res = await get("/notifications");
        console.log(res, 21);

        setNotifications(res); // No need for `.json()`, Axios already parses JSON

        // Check if there are any unread notifications
        setHasUnread(res.some((notif) => !notif.read));

        // Listen for real-time notifications
        socket.on("notification", (newNotification) => {
          setNotification((prev) => [newNotification, ...prev]);
          setHasUnread(true);
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchApi(); // Call the async function

    return () => {
      socket.off("notification"); // Clean up the socket listener
    };
  }, [notification]);

  const handleLogout = async () => {
    setIsLogoutDiv(false);
    logout();
    console.log(fetchMessage);

    // alert(res.message);
  };

  const handleNotificationClick = () => {
    setOpen(!open);
    if (open === false && hasUnread) {
      // Mark notifications as read when opening panel
      // This would typically involve an API call
      setHasUnread(false);
    }
  };

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread") return notifications.filter((n) => !n.read);
    if (activeTab === "messages")
      return notifications.filter((n) => n.type === "message");
    return notifications;
  };

  // Time ago function for notifications
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
  };

  const convertToNepaliTime = (utcDate) => {
    const date = new Date(utcDate);

    // Format date and time separately
    const formattedDate = date.toLocaleDateString("en-US", {
      timeZone: "Asia/Kathmandu",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kathmandu",
      hour: "2-digit",
      minute: "2-digit",
    });

    return { formattedDate, formattedTime };
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
                <div className="notification-wrapper">
                  <div
                    onClick={handleNotificationClick}
                    className="notification-trigger"
                  >
                    {hasUnread ? (
                      <>
                        <MdNotificationsActive className="notification-bell pulse" />
                        <span className="notification-badge"></span>
                      </>
                    ) : (
                      <IoIosNotifications className="notification-bell" />
                    )}
                  </div>
                </div>
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

        {/* Enhanced Notification Panel */}
        {open && (
          <div className="notification-panel">
            <div className="notification-header">
              <h3 className="notification-title">Notifications</h3>
              <div className="notification-tabs">
                <button
                  className={`tab-btn ${
                    activeTab === "all" ? "active-tab" : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </button>
                <button
                  className={`tab-btn ${
                    activeTab === "messages" ? "active-tab" : ""
                  }`}
                  onClick={() => setActiveTab("messages")}
                >
                  Messages
                </button>
              </div>
              <button
                className="close-notification-btn"
                onClick={() => setOpen(false)}
              >
                <AiOutlineClose />
              </button>
            </div>

            <div className="notification-list">
              {getFilteredNotifications().length > 0 ? (
                getFilteredNotifications().map((item, index) => {
                  const { formattedDate, formattedTime } = convertToNepaliTime(
                    item.created_at
                  );

                  // Determine icon based on notification type
                  let NotificationIcon = MdMessage; // Default icon
                  if (item.type === "booking")
                    NotificationIcon = BsCalendarCheck;
                  if (item.type === "message")
                    NotificationIcon = FiMessageSquare;
                  if (item.type === "alert") NotificationIcon = BsBellFill;

                  return (
                    <div
                      key={index}
                      className={`notification-item ${
                        !item.read ? "unread-notification" : ""
                      }`}
                    >
                      <div className="notification-icon-container">
                        <NotificationIcon className="notification-type-icon" />
                      </div>

                      <div className="notification-content">
                        <div className="notification-header-row">
                          <h4 className="notification-item-title">
                            {item.title}
                          </h4>
                          <span className="notification-time">
                            {timeAgo(item.created_at)}
                          </span>
                        </div>
                        <p className="notification-message">{item.message}</p>
                        <div className="notification-footer-info">
                          <span className="notification-date">
                            {formattedDate} • {formattedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-notification">
                  <MdNotificationsNone className="empty-icon" />
                  <p>No notifications to display</p>
                </div>
              )}
            </div>
          </div>
        )}
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
    </div>
  );
}
