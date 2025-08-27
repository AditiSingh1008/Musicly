// controllers/forgotPassword.js
import { User } from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found" });

  // 🔐 Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 🔄 Update DB with OTP + Expiry + Reset attempts
  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  user.resetOtpAttempts = 0;
  await user.save();

  // 📤 Send OTP to Email
  await sendEmail(
    email,
    "Your OTP for Password Reset",
    `Hi ${user.name},\n\nYour OTP is: ${otp}\nIt is valid for 15 minutes.\n\nIf you didn't request this, just ignore it.`
  );

  res.status(200).json({
    message: "OTP sent to your email",
  });
};
