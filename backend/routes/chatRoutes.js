// backend/routes/chatRoutes.js

import express from "express";
import axios from "axios";
import { Chat } from "../models/Chat.js";

const router = express.Router();

// ✅ POST /api/chat – AI reply + GIF + Save
router.post("/", async (req, res) => {
  const { message } = req.body;

  // Step 0: Validate empty input
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  try {
    // Step 1: Ask OpenRouter AI (GPT-3.5 Turbo)
    const openRouterResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // Your frontend URL
          "X-Title": "AudioZen AI Chatbot",
        },
      }
    );

    const reply = openRouterResponse.data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("AI did not return a valid response.");
    }

    // Step 2: Get Giphy GIF
    const gifRes = await axios.get("https://api.giphy.com/v1/gifs/search", {
      params: {
        api_key: process.env.GIPHY_API_KEY,
        q: message,
        limit: 1,
      },
    });

    const gifUrl = gifRes.data.data?.[0]?.images?.original?.url || null;

    // Step 3: Save chat in MongoDB
    await Chat.create({ userMsg: message, botReply: reply, gifUrl });

    // Step 4: Send final response
    res.json({ reply, gif: gifUrl });
  } catch (error) {
    console.error("❌ Chat Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ✅ GET /api/chat/history – Get last 20 messages
router.get("/history", async (req, res) => {
  try {
    const history = await Chat.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (error) {
    console.error("❌ History Error:", error.message);
    res.status(500).json({ error: "Unable to fetch chat history." });
  }
});

export default router;
