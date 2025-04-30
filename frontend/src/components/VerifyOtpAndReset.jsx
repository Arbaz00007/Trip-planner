import React, { useState, useEffect } from "react";
import { post } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Map,
  Luggage
} from "lucide-react";

const VerifyOtpAndReset = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [errors, setErrors] = useState({});

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
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear OTP error if exists
    if (errors.otp) {
      setErrors({ ...errors, otp: "" });
    }

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

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "" });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate OTP
    if (otp.join("").length !== 6) {
      newErrors.otp = "Please enter all 6 digits of the OTP";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await post("/api/reset-password", {
        email,
        otp: otp.join(""),
        newPassword: password,
      });

      if (res.success) {
        toast.success("Password reset successfully");
        navigate("/login");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred during password reset");
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
      const res = await post("/api/forgot-password", { email });

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
    navigate("/forgot-password");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 px-4 py-8 relative overflow-hidden">
      {/* Decorative elements */}
      
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border-t-4 border-purple-600 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 p-4 rounded-full">
            <Luggage className="text-purple-600 w-10 h-10" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to
          <span className="font-medium block text-purple-600">
            {email || "your email"}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Verification Code
            </label>
            <div className="flex justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-12 h-12 border-2 rounded-lg text-center text-xl font-bold text-gray-700 
                    ${errors.otp ? "border-red-500" : "border-gray-300"} 
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
                />
              ))}
            </div>
            {errors.otp && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.otp}
              </div>
            )}

            <div className="flex items-center justify-center mt-2 text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>
                {timeLeft > 0
                  ? `Expires in ${formatTime(timeLeft)}`
                  : "OTP expired"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading || timeLeft > 0}
              className="text-purple-600 hover:text-purple-800 font-medium disabled:text-gray-400 text-sm flex items-center justify-center w-full mt-2"
            >
              <RefreshCw className="w-4 h-4 inline mr-1" />
              Resend OTP
            </button>
          </div>

          {/* Password section with map background */}
          <div className="relative rounded-lg p-6 bg-purple-50 border border-purple-100">
            <div className="absolute inset-0 opacity-5 rounded-lg overflow-hidden pointer-events-none">
              <Map className="w-full h-full text-purple-500" />
            </div>
            
            {/* New Password Input */}
            <div className="space-y-2 relative z-10">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className={`w-full pl-10 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } bg-white rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all`}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2 mt-4 relative z-10">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 block"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm new password"
                  className={`w-full pl-10 py-3 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } bg-white rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all`}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg py-3 flex items-center justify-center transition-colors disabled:bg-purple-300"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Reset Password
              </>
            )}
          </button>
        </form>

        <button
          onClick={goBack}
          className="flex items-center justify-center w-full mt-8 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Forgot Password
        </button>
      </div>
      
      {/* Background design elements */}
      {/* <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10"></div> */}
      
      {/* Letter "E" as a distinctive element */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-purple-800">E</span>
      </div>
      
      {/* Letter "X" */}
      <div className="absolute top-10 right-1/4 transform translate-x-1/2 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-indigo-800">X</span>
      </div>
      
      {/* Letter "P" */}
      <div className="absolute top-1/4 left-10 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-purple-800">P</span>
      </div>
      
      {/* Letter "L" */}
      <div className="absolute bottom-1/4 right-10 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-indigo-800">L</span>
      </div>
      
      {/* Letter "O" */}
      <div className="absolute top-3/4 left-1/4 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-purple-800">O</span>
      </div>
      
      {/* Letter "R" */}
      <div className="absolute top-1/3 right-1/3 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-indigo-800">R</span>
      </div>
      
      {/* Letter "E" */}
      <div className="absolute bottom-1/3 left-1/3 opacity-5 pointer-events-none">
        <span className="text-9xl font-bold text-purple-800">E</span>
      </div>
    </div>
  );
};

export default VerifyOtpAndReset;