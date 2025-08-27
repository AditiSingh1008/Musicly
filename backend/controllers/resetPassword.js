// controllers/resetPassword.js
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({ message: "User not found" });

  // Check if OTP expired
  if (!user.resetOtp || user.resetOtpExpiry < Date.now()) {
    return res.status(400).json({ message: "OTP expired. Please request a new one." });
  }

  // Check if attempts exceeded
  if (user.resetOtpAttempts >= 3) {
    return res.status(403).json({ message: "Too many incorrect attempts. Please request a new OTP." });
  }

  // Validate OTP
  if (user.resetOtp !== otp) {
    user.resetOtpAttempts += 1;
    await user.save();
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  // Hash and set new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  // Clear OTP-related fields
  user.resetOtp = null;
  user.resetOtpExpiry = null;
  user.resetOtpAttempts = 0;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};
