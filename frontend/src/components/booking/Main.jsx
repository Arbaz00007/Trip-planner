import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FiBell, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import { useState, useEffect } from "react";

const Main = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your booking to Chitwan has been confirmed", isNew: true, time: "2 hours ago" },
    { id: 2, text: "Price drop alert for Pokhara package", isNew: false, time: "Yesterday" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const newNotificationsCount = notifications.filter((n) => n.isNew).length;
  
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isNew: false } : n))
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showNotifications) setShowNotifications(false);
      if (showProfile) setShowProfile(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showProfile]);

  return (
    <div className="bg-gray-50 h-[calc(100vh-5rem)]">

      {/* Main Content */}
      <div className="container mx-auto h-full p-4 flex gap-6">
        
        {/* Sidebar */}
        <div 
          className={`${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static left-0 top-0 h-full z-30 md:z-0 transition-transform duration-300 ease-in-out md:w-64 md:sticky md:top-4`}
        >
          <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-2 bg-white rounded-xl shadow-sm mt-4 overflow-y-scroll w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;