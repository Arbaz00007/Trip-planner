import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { useState } from "react";

const Main = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your booking to Chitwan has been confirmed", isNew: true },
    { id: 2, text: "Price drop alert for Pokhara package", isNew: false },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const newNotificationsCount = notifications.filter((n) => n.isNew).length;

  return (
    <div className="bg-gray-50 h-screen">
      {/* Main Content */}
      <div className="container mx-auto p-4 flex gap-6">
        <div className="w-64 sticky top-4">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 bg-white rounded-xl shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
