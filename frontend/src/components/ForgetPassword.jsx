import React, { useState } from "react";
import { post } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Plane,
  Compass
} from "lucide-react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state
    setEmailError("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await post("/api/forgot-password", { email });

      if (res.success) {
        toast.success("OTP sent to your email");
        navigate(`/verify-otp-reset?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred while requesting OTP");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 px-4 py-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10">
        <img src="/api/placeholder/150/150" alt="Hot air balloon" className="opacity-80" />
      </div>
      <div className="absolute bottom-10 right-10">
        <img src="/api/placeholder/150/150" alt="Hot air balloon" className="opacity-80" />
      </div>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border-t-4 border-purple-600 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 p-4 rounded-full">
            <Compass className="text-purple-600 w-10 h-10" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter your email address and we'll send you an OTP to reset your
          password
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full pl-10 py-3 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all`}
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
            </div>
            {emailError && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {emailError}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg py-3 flex items-center justify-center transition-colors disabled:bg-purple-300"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <button
          onClick={goToLogin}
          className="flex items-center justify-center w-full mt-8 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </button>
      </div>
      
      {/* Letter "D" on the bottom */}
      <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-purple-800">D</span>
      </div>
      
      {/* Letter "R" */}
      <div className="absolute bottom-0 left-2/4 transform -translate-x-1/2 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-purple-800">R</span>
      </div>
      
      {/* Letter "E" */}
      <div className="absolute bottom-0 right-2/4 transform translate-x-1/2 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-purple-800">E</span>
      </div>
      
      {/* Letter "A" */}
      <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-purple-800">A</span>
      </div>
      
      {/* Letter "M" */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-purple-800">M</span>
      </div>
    </div>
  );
};

export default ForgetPassword;