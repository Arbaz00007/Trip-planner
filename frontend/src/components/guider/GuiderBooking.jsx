import React, { useContext, useEffect, useState } from "react";
import { get, post } from "../../utils/api";
import { AuthContext } from "../../context/authContext";
import { 
  IoLocationOutline, 
  IoPricetag, 
  IoEyeOutline, 
  IoCheckmarkCircleOutline,
  IoTrashOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoHomeOutline
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const GuiderBooking = () => {
  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState("booking");
  const [reload, setReload] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const res = await get("/api/getAllBookingDetails");
      const updatedRes = res.map((item) => ({
        ...item,
        images: item.images ? item.images.split(",") : [],
      }));
      setPackages(updatedRes);
    } catch (error) {
      toast.error("Failed to fetch booking details");
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  const handleComplete = async (bid, pid) => {
    try {
      const res = await post(`/api/compeleteBooking/${bid}/${pid}`);
      setReload((prev) => prev + 1);
      toast.success(res.message);
    } catch (error) {
      toast.error("Failed to complete booking");
    }
  };

  const openUserModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const UserDetailsModal = () => {
    if (!selectedBooking) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">User Details</h2>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <IoPersonOutline className="text-primary text-xl" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{selectedBooking.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <IoMailOutline className="text-primary text-xl" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{selectedBooking.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <IoCallOutline className="text-primary text-xl" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{selectedBooking.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <IoHomeOutline className="text-primary text-xl" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{selectedBooking.address}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            {activeTab === "booking" && (
              <button
                onClick={() => {
                  handleComplete(selectedBooking.booking_id, selectedBooking.pid);
                  setShowModal(false);
                }}
                className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
              >
                <IoCheckmarkCircleOutline /> Complete
              </button>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TabSelector = () => (
    <div className="bg-white rounded-lg shadow-md p-1 inline-flex mx-auto mb-6">
      <button
        onClick={() => setActiveTab("booking")}
        className={`px-6 py-2 rounded-md font-medium transition-all ${
          activeTab === "booking" 
            ? "bg-primary text-white" 
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Users Booking
      </button>
      <button
        onClick={() => setActiveTab("booked")}
        className={`px-6 py-2 rounded-md font-medium transition-all ${
          activeTab === "booked" 
            ? "bg-primary text-white" 
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Already Booked
      </button>
    </div>
  );

  const PackageCard = ({ value }) => (
    <div className="w-full sm:w-80 md:w-96 bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
      <div className="h-52 overflow-hidden relative">
        <img
          src={`http://localhost:5050${value.images[0]}`}
          alt={value.pname}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg">
          {value.status}
        </div>
      </div>
      
      <div className="p-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-1 line-clamp-1">{value.pname}</h2>
        
        <div className="flex items-center text-gray-600 mb-3">
          <IoLocationOutline className="mr-1" />
          <span className="text-sm">{value.location}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-t border-b border-gray-200 my-3">
          <div className="flex items-center">
            <IoPricetag className="text-primary mr-2" />
            <span className="font-medium text-gray-700">Price</span>
          </div>
          <span className="text-xl font-bold text-primary">Rs. {value.price}</span>
        </div>
        
        {activeTab === "booked" && (
          <p className="text-gray-600 mb-4 text-sm line-clamp-3">
            {value.description?.slice(0, 150)}...
          </p>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => openUserModal(value)}
            className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-lightPrimary transition-all"
          >
            <IoEyeOutline /> View
          </button>
          
          {activeTab === "booking" && (
            <button
              onClick={() => handleComplete(value.booking_id, value.pid)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
            >
              <IoCheckmarkCircleOutline /> Complete
            </button>
          )}
          
          <button
            className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
          >
            <IoTrashOutline /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  const filteredPackages = packages.filter(
    (pkg) => pkg.uid === currentUser?.id && 
             pkg.status === (activeTab === "booking" ? "Pending" : "Completed")
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Users Bookings</h1>
        
        <div className="flex justify-center mb-8">
          <TabSelector />
        </div>
        
        <div className="border border-gray-200 rounded-xl bg-white p-6">
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((value, ind) => (
                <PackageCard key={ind} value={value} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <svg 
                className="w-16 h-16 text-gray-300 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-500">
                No {activeTab === "booking" ? "Pending" : "Completed"} Bookings Found
              </h2>
              <p className="text-gray-400 mt-2">
                {activeTab === "booking" 
                  ? "You don't have any pending bookings at the moment" 
                  : "You haven't completed any bookings yet"}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {showModal && <UserDetailsModal />}
    </div>
  );
};

export default GuiderBooking;