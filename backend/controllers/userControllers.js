import { User } from "../models/User.js";
import TryCatch from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

// 🔐 Register User
export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) return res.status(400).json({ message: "User Already Exists" });

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  generateToken(user._id, res);
  res.status(201).json({ user, message: "User Registered" });
});

// 🔐 Login User
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "No User Exist" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong Password" });

  generateToken(user._id, res);
  res.status(200).json({ user, message: "User LoggedIN" });
});

// 👤 My Profile
// export const myProfile = TryCatch(async (req, res) => {
//   const user = await User.findById(req.user._id);
//   res.json(user);
// });

// 👤 My Profile (update this)
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("playlist", "title artist")  // ✅ populate song title & artist

  res.json(user);
});

// 🚪 Logout
export const logoutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "Logged Out Successfully" });
});

// 🎵 Save/Remove from Playlist
export const saveToPlaylist = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const songId = req.params.id;

  if (user.playlist.includes(songId)) {
    user.playlist = user.playlist.filter((id) => id !== songId);
    await user.save();
    return res.json({ message: "Removed from playlist" });
  }

  user.playlist.push(songId);
  await user.save();
  res.json({ message: "Added to playlist" });
});

// 📌 Get User Profile for Dashboard
export const getUserProfile = TryCatch(async (req, res) => {
 const user = await User.findById(req.user._id)
  .populate("mostPlayedSongs") // ← Yeh line add karo
  .populate("lastPlayedSong"); // ← Yeh bhi


  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ user });
});

// 📝 Update User Profile (name only)
export const updateUserProfile = TryCatch(async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  if (name) user.name = name;
  await user.save();

  res.status(200).json({ message: "Profile updated successfully" });
});

// 📊 Track Listening Stats (Daily/Weekly)
export const updateListeningStats = async (userId, minutes, type = "daily") => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  let dateKey;

  if (type === "daily") {
    dateKey = today.toISOString().split("T")[0]; // "2025-08-05"
  } else {
    const week = `${today.getFullYear()}-W${Math.ceil(today.getDate() / 7)}`;
    dateKey = week;
  }

  const statIndex = user.listeningStats.findIndex(
    (stat) => stat.type === type && stat.date === dateKey
  );

  if (statIndex !== -1) {
    user.listeningStats[statIndex].minutesListened += minutes;
  } else {
    user.listeningStats.push({
      type,
      date: dateKey,
      minutesListened: minutes,
    });
  }

  await user.save();
};


// 💎 Upgrade to Premium
export const upgradeToPremium = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isPremium)
    return res.status(400).json({ message: "Already a premium user" });

  user.isPremium = true;
  await user.save();
  res.status(200).json({ message: "Upgraded to premium!" });
});
