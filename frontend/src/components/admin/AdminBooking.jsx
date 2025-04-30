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
  IoTimeOutline,
  IoListOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminBooking = () => {
  const [packages, setPackages] = useState([]);
  const [activeTab, setActiveTab] = useState("booking");
  const [reload, setReload] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("details");
  const [userBookingHistory, setUserBookingHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
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

  const fetchUserBookingHistory = async (userId) => {
    if (!userId) return;

    setIsLoadingHistory(true);
    try {
      // Replace with your actual API endpoint
      const res = await get(
        `/api/getBookingByUser/${userId}`,
        { status: "Completed" } // sending status as query
      );
      console.log(res, "User booking history response");

      const updatedHistory = res.map((item) => ({
        ...item,
        images: item.images ? item.images.split(",") : [],
      }));
      setUserBookingHistory(updatedHistory);
    } catch (error) {
      toast.error("Failed to fetch user booking history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const openUserModal = (booking) => {
    console.log(booking, "Booking data for modal");

    setSelectedBooking(booking);
    setModalTab("details");
    setShowModal(true);

    // Fetch user booking history when opening modal
    // Assuming user_id exists in the booking object
    // You may need to adjust based on your actual data structure
    if (booking.user_id) {
      fetchUserBookingHistory(booking.user_id);
    }
  };

  const UserDetailsModal = () => {
    if (!selectedBooking) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-2xl font-bold text-gray-800">
              User Information
            </h2>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {selectedBooking.status}
            </div>
          </div>

          {/* Modal Tabs */}
          <div className="flex border-b mb-4 mt-2">
            <button
              onClick={() => setModalTab("details")}
              className={`px-4 py-2 font-medium text-sm ${
                modalTab === "details"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              User Details
            </button>
            <button
              onClick={() => setModalTab("history")}
              className={`px-4 py-2 font-medium text-sm ${
                modalTab === "history"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Booking History
            </button>
          </div>

          {modalTab === "details" ? (
            <div className="grid grid-cols-1 gap-4">
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
          ) : (
            <div className="booking-history">
              <div className="flex items-center gap-2 mb-4">
                <IoListOutline className="text-primary text-xl" />
                <h3 className="text-lg font-medium text-gray-800">
                  {selectedBooking.name}'s Booking History
                </h3>
              </div>

              {isLoadingHistory ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : userBookingHistory.length > 0 ? (
                <div className="space-y-4">
                  {userBookingHistory.map((booking, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">
                          {booking.pname}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            booking.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <IoLocationOutline />
                          <span>{booking.location}</span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-600">
                          <IoPricetag />
                          <span>Rs. {booking.price}</span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-600">
                          <IoCalendarOutline />
                          <span>
                            {new Date(booking.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-600">
                          <IoTimeOutline />
                          <span>{booking.time || "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex justify-end mt-2 gap-2">
                        <Link to={`/packages/our-package/${booking.pid}`}>
                          <button className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-lightPrimary transition-all">
                            <IoEyeOutline /> View Package
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <svg
                    className="w-12 h-12 text-gray-300 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>No booking history found</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            {activeTab === "booking" && modalTab === "details" && (
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
                <PackageCard key={ind} value={value} />
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
