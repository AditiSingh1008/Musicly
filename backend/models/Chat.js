import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userMsg: { type: String, required: true },
  botReply: { type: String, required: true },
  gifUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
});

// ✅ Named export
export const Chat = mongoose.model("Chat", ChatSchema);
