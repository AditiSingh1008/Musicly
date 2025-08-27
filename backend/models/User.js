import mongoose from "mongoose";

const listeningStatsSchema = new mongoose.Schema({
  type: {
    type: String, // "daily" or "weekly"
    enum: ["daily", "weekly"],
    required: true,
  },
  date: {
    type: String, // "2025-07-30" for daily, or "2025-W31" for weekly
    required: true,
  },
  minutesListened: {
    type: Number,
    default: 0,
  },
});

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },

    playlist: [
      {
        type: String,
        required: true,
      },
    ],

    // 🔐 Forgot Password OTP Flow
    resetOtp: {
      type: String,
    },
    resetOtpExpiry: {
      type: Date,
    },
    resetOtpAttempts: {
      type: Number,
      default: 0,
    },

    // ⭐ Premium
    isPremium: {
      type: Boolean,
      default: false,
    },

    // 🎧 Listening data
    mostPlayedSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song", // will create Song model
      },
    ],
    lastPlayedSong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },

    // 📊 Stats for charts
    listeningStats: [listeningStatsSchema],
  },

  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
