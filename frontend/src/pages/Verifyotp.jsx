import React, { useState, useEffect } from "react";
import { post } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import ballon1 from '../image/img/balloon1.avif'
import ballon2 from '../image/img/balloon2.avif'
import { toast } from "react-toastify";
import {
  Shield,
  CheckCircle,
  Clock,
  ArrowLeft,
  RefreshCw,
  Plane,
} from "lucide-react";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle input change for each OTP digit
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await post("/api/verify-otp", { email, otp: otpValue });

      if (res.message === "User registered successfully.") {
        toast.success(res.message);
        navigate("/login");
      } else {
        toast.error(res.message || "Verification failed");
      }
    } catch (error) {
      toast.error("An error occurred during verification");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle resending OTP
  const handleResendOtp = async () => {
    if (timeLeft > 0) return;

    try {
      setLoading(true);
      const res = await post("/api/resend-otp", { email });

      if (res.success) {
        toast.success("OTP resent successfully");
        setTimeLeft(300); // Reset timer
        setOtp(["", "", "", "", "", ""]);
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("An error occurred while resending OTP");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 px-4 py-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10">
        <img
          src={ballon2}
          alt="Hot air balloon"
          className="opacity-80"
        />
      </div>
      <div className="absolute bottom-10 right-10">
        <img
          src={ballon1}
          alt="Hot air balloon"
          className="opacity-80"
        />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border-t-4 border-purple-600 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 p-4 rounded-full">
            <Plane className="text-purple-600 w-10 h-10" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Please enter the 6-digit code sent to
          <span className="font-medium block text-purple-600">
            {email || "your email"}
          </span>
        </p>

        <div className="flex justify-between mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 border-2 rounded-lg text-center text-xl font-bold text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          ))}
        </div>

        <div className="flex items-center justify-center mb-6 text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {timeLeft > 0
              ? `Expires in ${formatTime(timeLeft)}`
              : "OTP expired"}
          </span>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg py-3 flex items-center justify-center transition-colors disabled:bg-purple-300"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Verify OTP
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            disabled={loading || timeLeft > 0}
            className="text-purple-600 hover:text-purple-800 font-medium disabled:text-gray-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-1" />
            Resend OTP
          </button>
        </div>

        <button
          onClick={goBack}
          className="flex items-center justify-center w-full mt-8 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to previous step
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

export default VerifyOtp;
