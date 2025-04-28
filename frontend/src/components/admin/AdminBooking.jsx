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
  IoHomeOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminBooking = () => {
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
      if (showModal) setShowModal(false);
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
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {selectedBooking.status}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                <IoPersonOutline className="text-primary text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{selectedBooking.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                <IoMailOutline className="text-primary text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{selectedBooking.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                <IoCallOutline className="text-primary text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{selectedBooking.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                <IoHomeOutline className="text-primary text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{selectedBooking.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                <IoLocationOutline className="text-primary text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Package Location</p>
                <p className="font-medium">{selectedBooking.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                <IoPricetag className="text-primary text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Package Price</p>
                <p className="font-medium">Rs. {selectedBooking.price}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            {activeTab === "booking" && (
              <button
                onClick={() => {
                  handleComplete(
                    selectedBooking.booking_id,
                    selectedBooking.pid
                  );
                }}
                className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
              >
                <IoCheckmarkCircleOutline /> Complete
              </button>
            )}
            <Link to={`/packages/our-package/${selectedBooking.pid}`}>
              <button className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-lightPrimary transition-all">
                <IoEyeOutline /> View Package
              </button>
            </Link>
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

  const BookingStats = () => {
    const pendingCount = packages.filter(
      (pkg) => pkg.status === "Pending"
    ).length;
    const completedCount = packages.filter(
      (pkg) => pkg.status === "Completed"
    ).length;
    const totalCount = packages.length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Bookings</p>
              <h3 className="text-2xl font-bold">{totalCount}</h3>
            </div>
            <div className="p-3 bg-primary bg-opacity-10 rounded-full">
              <IoStatsChartOutline className="text-primary text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Bookings</p>
              <h3 className="text-2xl font-bold">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <IoCalendarOutline className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Completed Bookings</p>
              <h3 className="text-2xl font-bold">{completedCount}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <IoCheckmarkCircleOutline className="text-green-500 text-xl" />
            </div>
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:shadow-lg transition-all duration-300">
      <div className="h-48 relative">
        <img
          src={`http://localhost:5050${value.images[0]}`}
          alt={value.pname}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg font-medium">
          {value.status}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
          {value.pname}
        </h2>

        <div className="flex items-center text-gray-600 mb-3">
          <IoLocationOutline className="mr-1" />
          <span className="text-sm">{value.location}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-t border-b border-gray-200 my-2">
          <div className="flex items-center">
            <IoPricetag className="text-primary mr-2" />
            <span className="font-medium text-gray-700">Price</span>
          </div>
          <span className="text-lg font-bold text-primary">
            Rs. {value.price}
          </span>
        </div>

        {activeTab === "booked" ? (
          <p className="text-gray-600 my-2 text-sm line-clamp-2">
            {value.description?.slice(0, 120)}...
          </p>
        ) : (
          <div className="flex items-center gap-4 my-2">
            <div className="flex-1">
              <div className="text-xs text-gray-500">Booked By</div>
              <div className="font-medium truncate">{value.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Contact</div>
              <div className="font-medium">{value.phone}</div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => openUserModal(value)}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-lightPrimary transition-all"
          >
            <IoEyeOutline /> View
          </button>

          {activeTab === "booking" && (
            <button
              onClick={() => handleComplete(value.booking_id, value.pid)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
            >
              <IoCheckmarkCircleOutline /> Complete
            </button>
          )}

          <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all">
            <IoTrashOutline /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  const filteredPackages = packages.filter(
    (pkg) => pkg.status === (activeTab === "booking" ? "Pending" : "Completed")
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Booking Management
          </h1>
          <span className="bg-primary text-white px-4 py-2 rounded-lg">
            Admin Dashboard
          </span>
        </div>

        <BookingStats />

        <div className="flex justify-center mb-6">
          <TabSelector />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredPackages.map((value, ind) => (
                <>
                  <PackageCard key={ind} value={value} />
                </>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
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
              <h2 className="text-xl font-bold text-gray-500">
                No {activeTab === "booking" ? "Pending" : "Completed"} Bookings
                Found
              </h2>
              <p className="text-gray-400 mt-2">
                There are no {activeTab === "booking" ? "pending" : "completed"}{" "}
                bookings at the moment
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && <UserDetailsModal />}
    </div>
  );
};

export default AdminBooking;
