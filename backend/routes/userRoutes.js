import express from "express";
import {
  loginUser,
  logoutUser,
  myProfile,
  registerUser,
  saveToPlaylist,
  getUserProfile,
  updateUserProfile,
  updateListeningStats,
  // trackListeningStats,
  upgradeToPremium,
} from "../controllers/userControllers.js";
import { forgotPassword } from "../controllers/forgotPassword.js";
import { resetPassword } from "../controllers/resetPassword.js";
// import {
//   getUserProfile,
//   updateUserProfile,
//   trackListeningStats,
//   upgradeToPremium,
// } from "../controllers/userControllers.js"; // ✅ new

import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// 🔐 Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.get("/logout", isAuth, logoutUser);
router.post("/song/:id", isAuth, saveToPlaylist);

// 🔁 Forgot password
router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);

// 📊 Dashboard-related routes (NEW ✅)
router.get("/profile/:id", isAuth, getUserProfile);
router.put("/profile/:id", isAuth, updateUserProfile);
router.post("/stats", isAuth, updateListeningStats,);

router.post("/upgrade-premium", isAuth, upgradeToPremium);

export default router;
