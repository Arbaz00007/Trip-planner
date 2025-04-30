import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { get } from "../../utils/api";

// Icons
import { IoMdArrowRoundBack, IoMdCalendar, IoMdCash } from "react-icons/io";
import { FaUser, FaBox, FaReceipt, FaMoneyBillWave } from "react-icons/fa";
import { RiSecurePaymentFill } from "react-icons/ri";
import { FcCancel } from "react-icons/fc";
import { FaEthereum } from "react-icons/fa";

const Checkout = () => {
  const { pid, date } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [esewa, setEsewa] = useState({});
  const [img, setImg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadEsewa = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5050/api/verifyEsewa/${parseInt(pid)}`
      );
      setEsewa(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log("Error loading eSewa data:", err);
      setIsLoading(false);
    }
  };

  function splitImagePaths(imageString) {
    return imageString ? imageString.split(",") : [];
  }

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await get(`/api/getSinglePost/${parseInt(pid)}`);
      setProducts(response);
      setImg(splitImagePaths(response.images)[0]);
      setIsLoading(false);
    } catch (err) {
      console.log("Error fetching product data:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadEsewa();
  }, []);

  function formatNumberCustom(number) {
    if (!number) {
      return "";
    }
    let numStr = number.toString().split("").reverse().join("");
    let firstPart = numStr.slice(0, 3);
    let restPart = numStr.slice(3);
    let groupedRest = restPart.match(/.{1,2}/g) || [];
    let formattedNumber =
      firstPart + (groupedRest.length ? "," + groupedRest.join(",") : "");
    return formattedNumber.split("").reverse().join("");
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center font-heading">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-10 bg-gray-50 font-heading">
      <div className="max-w-6xl mx-auto h-auto relative rounded-xl shadow-2xl bg-white border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full hover:bg-primary-dark transition-all duration-300"
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack className="text-2xl" />
            </button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-xl" />
            <span className="capitalize font-medium">{currentUser.name}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Left Section - Order Details */}
          <div className="detail w-full md:w-1/2 p-6 flex flex-col gap-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaReceipt className="text-primary" /> Package Summary
              </h2>

              <div className="product flex flex-col md:flex-row border border-gray-200 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="img h-24 w-24 rounded-md overflow-hidden flex-shrink-0 mb-4 md:mb-0">
                  <img
                    className="h-full w-full object-cover"
                    src={`http://localhost:5050${img}`}
                    alt={products.pname}
                  />
                </div>
                <div className="flex flex-col w-full md:ml-4">
                  <div className="font-bold text-lg flex flex-col md:flex-row justify-between w-full mb-2">
                    <div className="flex items-center">
                      <FaBox className="text-primary mr-2" />
                      <span className="text-gray-800">{products.pname}</span>
                    </div>
                    <span className="font-bold text-lg text-primary mt-2 md:mt-0">
                      Rs.{formatNumberCustom(parseInt(products?.price))}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <IoMdCalendar className="text-primary mr-2" />
                    <span>
                      Starting: <span className="font-semibold">{date}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-primary" /> Price Details
              </h2>
              <div className="flex flex-col space-y-2 px-2">
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                  <span className="text-gray-600">Subtotal</span>
                  <span>
                    Rs. {formatNumberCustom(parseInt(products?.price))}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-300">
                  <span className="text-gray-600">Extra Charge</span>
                  <span>Rs. 0</span>
                </div>
                <div className="flex justify-between items-center py-2 font-bold text-lg">
                  <span>Total Due</span>
                  <span className="text-primary">
                    Rs. {formatNumberCustom(parseInt(products?.price))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Payment Options */}
          <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 p-6">
            <div className="flex flex-col h-full justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <RiSecurePaymentFill className="text-primary" /> Payment
                  Options
                </h2>

                <form
                  action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
                  method="POST"
                  className="w-full"
                >
                  <input
                    hidden
                    type="text"
                    id="amount"
                    name="amount"
                    value={parseInt(products?.price)}
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="tax_amount"
                    name="tax_amount"
                    value="0"
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="total_amount"
                    name="total_amount"
                    value={parseInt(products?.price)}
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="transaction_uuid"
                    name="transaction_uuid"
                    value={esewa?.uuid}
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="product_code"
                    name="product_code"
                    value="EPAYTEST"
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="product_service_charge"
                    name="product_service_charge"
                    value="0"
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="product_delivery_charge"
                    name="product_delivery_charge"
                    value="0"
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="success_url"
                    name="success_url"
                    value={`http://localhost:5050/api/success/${pid}/${currentUser.id}/${date}`}
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="failure_url"
                    name="failure_url"
                    value="http://localhost:5173"
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="signed_field_names"
                    name="signed_field_names"
                    value="total_amount,transaction_uuid,product_code"
                    required
                  />
                  <input
                    hidden
                    type="text"
                    id="signature"
                    name="signature"
                    value={esewa?.signature}
                    required
                  />

                  <div className="payment-options space-y-4">
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 w-full p-4 rounded-lg bg-[#67BD4C] hover:bg-[#5aab41] text-white font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <FaEthereum className="text-2xl" />
                      Pay with eSewa
                    </button>

                  </div>
                </form>
              </div>

              <div className="mt-8">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Your payment is secure and encrypted. We respect your
                        privacy.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition-all duration-300"
                >
                  <FcCancel className="text-xl bg-white rounded-full" />
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
