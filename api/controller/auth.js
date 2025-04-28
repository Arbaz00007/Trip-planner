import { db } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/mail.js";
import crypto from "crypto";
const pendingRegistrations = {}; // Store pending user registrations temporarily

export const register = async (req, res) => {
  const { name, address, phone, email, password, role_id } = req.body;

  try {
    // Check if user already exists
    const q = "SELECT * FROM `users` WHERE `email` = ?";
    db.query(q, [email], async (err, data) => {
      if (err)
        return res.status(500).json({ error: "Database error.", details: err });
      if (data.length)
        return res.status(409).json({ error: "User already exists." });

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      console.log(password, "password from register function");

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Store registration temporarily
      pendingRegistrations[email] = {
        name,
        address,
        phone,
        email,
        password: hashedPassword,
        role_id,
        otp,
        createdAt: Date.now(), // (optional) You can later auto-expire pending registrations
      };

      // Send OTP email
      await sendOtpEmail(email, otp);

      res
        .status(200)
        .json({ message: "OTP sent to your email for verification." });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong.", details: error.message });
  }
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const registration = pendingRegistrations[email];

  if (!registration) {
    return res.status(404).json({ message: "No registration found." });
  }

  if (parseInt(otp) !== registration.otp) {
    return res.status(200).json({ message: "Invalid OTP.", success: 0 });
  }

  // // Register the user
  // const salt = bcrypt.genSaltSync(10);
  // const hashedPassword = bcrypt.hashSync(registration.password, salt);
  const q =
    "INSERT INTO users (`name`, `address`, `phone`, `email`, `password`, `role_id`) VALUE (?,?,?,?,?,?)";
  db.query(
    q,
    [
      registration.name,
      registration.address,
      registration.phone,
      registration.email,
      registration.password,
      registration.role_id,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      delete pendingRegistrations[email]; // Remove from temp store
      res.status(201).json({ message: "User registered successfully." });
    }
  );
};
export const requestPasswordReset = (req, res) => {
  const { email } = req.body;

  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  const insertOtpQuery =
    "INSERT INTO password_reset_otps (email, otp, expires_at) VALUES (?, ?, ?)";
  db.query(insertOtpQuery, [email, otp, expiresAt], (err, result) => {
    if (err) return res.status(500).json(err);
    sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email.", success: 1 });
  });
};
export const resetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;

  const checkOtpQuery =
    "SELECT * FROM password_reset_otps WHERE email = ? ORDER BY id DESC LIMIT 1";
  db.query(checkOtpQuery, [email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length)
      return res.status(400).json({ message: "OTP not found." });

    const otpData = data[0];
    const now = new Date();

    if (otpData.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP." });
    if (now > otpData.expires_at)
      return res.status(400).json({ message: "OTP expired." });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    const updatePasswordQuery = "UPDATE users SET password = ? WHERE email = ?";
    db.query(updatePasswordQuery, [hashedPassword, email], (err, result) => {
      if (err) return res.status(500).json(err);

      const deleteOtpQuery = "DELETE FROM password_reset_otps WHERE email = ?";
      db.query(deleteOtpQuery, [email]); // optional: clean up

      res
        .status(200)
        .json({ message: "Password reset successfully.", success: 1 });
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM `users` WHERE `email` = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(404).json({ message: "User Not found." });

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword) return res.status(400).json("Password not match");

    // Generate JWT token with 1-month expiry
    const token = jwt.sign(
      { id: data[0].id, role_id: data[0].role_id },
      "secretkey",
      { expiresIn: "30d" } // Token valid for 30 days
    );

    const { password, ...others } = data[0];

    // Set cookie with 1-month expiry
    res
      .cookie("accessToken", token, {
        httpOnly: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict",
      })
      .status(200)
      .json({ others, token });
  });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken").json({ message: "Logout successfully." });
};
