import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

// Updated icon imports with more modern options
import {
  IoChatbubbleEllipsesOutline,
  IoArrowBackOutline,
  IoCalendarClearOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoCallOutline,
  IoPersonOutline,
  IoHomeOutline,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoChevronForwardOutline,
  IoStarOutline,
  IoStarSharp,
  IoSend,
} from "react-icons/io5";
import { FaRegMap, FaMapMarkerAlt } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";

import map from "../../image/img/map.png";
import { AuthContext } from "../../context/authContext";
import { get, post } from "../../utils/api";

const SinglePackage = () => {
  let { pid } = useParams();
  console.log("Package ID:", pid);

  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  console.log("Products:", products);

  const [imageArr, setImageArr] = useState([]);
  const [booked, setBooked] = useState([]);
  const [myMainImg, setMyMainImg] = useState(null);
  const [currType, setCurrType] = useState("");
  const [currPrice, setCurrPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // For tabbed content

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  // For maximum selectable date
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 10);
  const isDateDisabled = currentUser === null;

  const loadData = async () => {
    const response = await get(`/api/getSinglePost/${parseInt(pid)}`);
    setProducts(response);
  };

  const loadReviews = async () => {
    try {
      const response = await get(`/api/get-review-by-package/${parseInt(pid)}`);
      console.log("Reviews response:", response);

      if (response && Array.isArray(response)) {
        setReviews(response);

        // Calculate average rating
        if (response.length > 0) {
          const total = response.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          setAverageRating((total / response.length).toFixed(1));
        }

        // Check if current user has already reviewed
        if (currentUser) {
          const userReview = response.find(
            (review) => review.userId === currentUser.id
          );
          if (userReview) {
            setHasUserReviewed(true);
            setUserRating(userReview.rating);
            setUserReview(userReview.comment);
          }
        }
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const handleChatClick = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    navigate("/chat", {
      state: {
        packageId: pid,
        creatorId: products.uid,
        packageName: products.pname,
      },
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in to submit a review");
      navigate("/login");
      return;
    }

    const bookingData = booked.filter(
      (data) => data.package_id === parseInt(pid)
    );
    console.log("Booking Data:", bookingData);

    // setBooked(bookingData);

    if (!bookingData.length > 0) {
      toast.error("Please book this package to write review.");
      return;
    }

    if (currentUser.id)
      if (userRating === 0) {
        toast.error("Please select a rating");
        return;
      }

    try {
      await post("/api/create-review", {
        packageId: pid,
        userId: currentUser?.id,
        userName: currentUser.name,
        rating: userRating,
        comment: userReview,
      });

      toast.success("Review submitted successfully!");
      await loadReviews();
      setShowReviewForm(false);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
      console.error("Error submitting review:", error);
    }
  };

  const StarRating = ({
    rating,
    setRating,
    hover,
    setHover,
    size = "text-xl",
    interactive = true,
  }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <div
              key={index}
              onClick={() => interactive && setRating(ratingValue)}
              onMouseEnter={() => interactive && setHover(ratingValue)}
              onMouseLeave={() => interactive && setHover(0)}
              className={`${interactive ? "cursor-pointer" : ""} ${size}`}
            >
              {ratingValue <= (hover || rating) ? (
                <IoStarSharp className="text-yellow-500" />
              ) : (
                <IoStarOutline className="text-yellow-500" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const loadBooking = async () => {
    console.log(currentUser?.id);

    const res = await get(
      `/api/getBookingByUser/${parseInt(currentUser?.id)}?status=Completed`
    );
    console.log(res);
    setBooked(res);
  };

  useEffect(() => {
    loadData();
    loadReviews();
    loadBooking();
  }, [pid]);

  useEffect(() => {
    if (products) {
      const images = splitImagePaths(products?.images);
      setImageArr(images);
      setMyMainImg(images[0]);
      setCurrType(products?.type);
      setCurrPrice(products?.price);
    }
  }, [products]);

  function splitImagePaths(imageString) {
    return imageString ? imageString.split(",") : [];
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/packages">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-all text-gray-800 font-medium">
              <IoArrowBackOutline className="text-xl" /> Back to Packages
            </button>
          </Link>

          <button
            onClick={handleChatClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <IoChatbubbleEllipsesOutline className="text-xl" /> Message Host
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96 overflow-hidden">
                {myMainImg && (
                  <img
                    src={`http://localhost:5050${myMainImg}`}
                    alt={products?.pname}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 grid grid-cols-3 gap-4">
                {imageArr?.map((data, inx) => (
                  <div
                    key={inx}
                    className={`h-24 rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                      myMainImg === data
                        ? "border-blue-500 shadow-md"
                        : "border-transparent"
                    }`}
                    onClick={() => setMyMainImg(data)}
                  >
                    <img
                      src={`http://localhost:5050${data}`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Host Information */}
              <div className="border-t border-gray-200">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Package Host
                  </h3>
                  <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <IoPersonOutline className="text-blue-600" />
                      <span className="font-medium">{products?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoCallOutline className="text-blue-600" />
                      <span>{products?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IoHomeOutline className="text-blue-600" />
                      <span>{products?.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Ratings & Reviews
                    </h2>
                    <div className="flex items-center mt-2">
                      <StarRating
                        rating={Math.round(averageRating)}
                        setRating={() => {}}
                        hover={0}
                        setHover={() => {}}
                        interactive={false}
                      />
                      <span className="ml-2 text-gray-700 font-medium">
                        {averageRating}/5
                      </span>
                      <span className="ml-2 text-gray-500">
                        ({reviews.length} reviews)
                      </span>
                    </div>
                  </div>

                  {currentUser && !hasUserReviewed && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      Write a Review
                    </button>
                  )}
                </div>

                {/* Review Submission Form */}
                {showReviewForm && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Your Review
                    </h3>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                          Rating
                        </label>
                        <StarRating
                          rating={userRating}
                          setRating={setUserRating}
                          hover={hoverRating}
                          setHover={setHoverRating}
                          size="text-2xl"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                          Comment
                        </label>
                        <textarea
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="4"
                          placeholder="Share your experience with this package..."
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <IoSend /> Submit Review
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Review List */}
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div
                        key={index}
                        className={`${index > 0 ? "border-t pt-6" : ""}`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                              {review.reviewer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {review.reviewer_name}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {formatDate(review.created_at)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <StarRating
                              rating={review.rating}
                              setRating={() => {}}
                              hover={0}
                              setHover={() => {}}
                              interactive={false}
                              size="text-lg"
                            />
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">
                        No reviews yet. Be the first to leave a review!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Package Title */}
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {products?.pname}
              </h1>

              {/* Ratings Preview */}
              <div className="flex items-center mb-3">
                <StarRating
                  rating={Math.round(averageRating)}
                  setRating={() => {}}
                  hover={0}
                  setHover={() => {}}
                  interactive={false}
                  size="text-lg"
                />
                <span className="ml-2 text-gray-700">{averageRating}/5</span>
                <span className="ml-2 text-gray-500 text-sm">
                  ({reviews.length} reviews)
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <IoLocationOutline className="text-blue-600" />
                <span>{products?.location}</span>
              </div>

              {/* Price and Duration */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="font-semibold text-blue-700">
                    Rs. {parseInt(products?.price)}
                  </span>
                  <span className="text-gray-500 text-sm">per person</span>
                </div>
                <div className="bg-blue-50 rounded-lg px-4 py-2 flex items-center gap-2">
                  <IoTimeOutline className="text-blue-600" />
                  <span className="text-gray-700">{products?.time}</span>
                </div>
              </div>

              {/* Booking Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Book this Package
                </h3>

                {products?.isBooked === "Booked" ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                    <IoInformationCircleOutline className="text-xl text-red-600 mr-2" />
                    <p className="text-red-700">
                      This package is already booked
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <ReactDatePicker
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                        maxDate={maxDate}
                        placeholderText="Select Date"
                        disabled={isDateDisabled}
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <IoCalendarClearOutline className="text-xl" />
                      </div>
                    </div>

                    {currentUser ? (
                      selectedDate ? (
                        <Link
                          to={`/package/checkout/${pid}/${
                            selectedDate.toISOString().split("T")[0]
                          }`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center transition-colors font-medium"
                        >
                          Book Now
                        </Link>
                      ) : (
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                          onClick={() => toast.error("Please select a date")}
                        >
                          Book Now
                        </button>
                      )
                    ) : (
                      <Link
                        to="/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center transition-colors font-medium"
                      >
                        Sign In to Book
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Tabbed Content Navigation */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="flex gap-4">
                  <button
                    className={`py-2 px-1 relative ${
                      activeTab === "overview"
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                    {activeTab === "overview" && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                  <button
                    className={`py-2 px-1 relative ${
                      activeTab === "itinerary"
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("itinerary")}
                  >
                    Itinerary
                    {activeTab === "itinerary" && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                  <button
                    className={`py-2 px-1 relative ${
                      activeTab === "details"
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                    {activeTab === "details" && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                </nav>
              </div>

              {/* Tabbed Content */}
              <div className="overflow-y-auto max-h-64">
                {activeTab === "overview" && (
                  <div className="text-gray-700 text-sm leading-relaxed">
                    <p>{products?.description}</p>
                  </div>
                )}

                {activeTab === "itinerary" && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <FaMapMarkerAlt className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          You'll get picked up
                        </p>
                        <a
                          href="#departure"
                          className="text-blue-600 text-sm font-medium flex items-center"
                        >
                          See departure details{" "}
                          <IoChevronForwardOutline className="ml-1" />
                        </a>
                      </div>
                    </div>

                    {Array.isArray(products?.itinerary) &&
                      products?.itinerary.map((stop, ind) => (
                        <div key={ind} className="flex items-start space-x-3">
                          <div className="mt-1">
                            <BsCircleFill className="text-blue-600 text-xs" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {stop.place_name}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {stop.duration} • {stop.admission}
                            </p>
                          </div>
                        </div>
                      ))}

                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <FaMapMarkerAlt className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Return to starting point
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                        <IoCheckmarkCircleOutline className="text-blue-600 mr-2" />{" "}
                        What's included
                      </h3>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        {products?.included}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                        <IoInformationCircleOutline className="text-blue-600 mr-2" />{" "}
                        What to expect
                      </h3>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        {products?.expect}
                      </div>
                    </div>

                    <div id="departure">
                      <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                        <FaRegMap className="text-blue-600 mr-2" /> Departure
                        and return
                      </h3>
                      <div className="text-gray-700 text-sm leading-relaxed">
                        {products?.departure || products?.included}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-4 border-b border-gray-200">
            Location
          </h2>
          <div className="h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594818.8896156745!2d81.48912054987576!3d28.371988493731564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995e8c77d2e68cf%3A0x34a29abcd0cc86de!2sNepal!5e0!3m2!1sen!2snp!4v1739361527580!5m2!1sen!2snp"
              className="h-full w-full"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePackage;
