import express from "express";
import {
    register,
    login,
    logout,
    verifyOtp,
    requestPasswordReset,
    resetPassword,
  } from "../controller/auth.js";

const route = express.Router();

route.post("/register", register);
route.post("/forgot-password", requestPasswordReset);
route.post("/reset-password", resetPassword);
route.post("/verify-otp", verifyOtp);
route.post("/login", login);
route.post("/logout", logout);

export default route;
