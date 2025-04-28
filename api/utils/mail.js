// utils/mail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  const mailOptions = {
    from: `"YourApp Support" <${process.env.EMAIL_USER}>`,
    to,
    subject:
      "🔐 Your One-Time Password (OTP) for Account Verification TravelMate",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #4bae30;">Account Verification - OTP Code</h2>
        <p>Hello,</p>
        <p>We received a request to register an account using your email address. Please use the following One-Time Password (OTP) to complete your verification:</p>
        <div style="font-size: 24px; font-weight: bold; background: #f0f0f0; padding: 10px 20px; display: inline-block; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">Thank you,<br />YourApp Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
