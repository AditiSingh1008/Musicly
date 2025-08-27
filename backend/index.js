import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import userRoutes from "./routes/userRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import explorePremiumRoutes from "./routes/explorePremiumRoutes.js";
import chatRoute from "./routes/chatRoutes.js";

dotenv.config();
connectDb();

const app = express();
const port = process.env.PORT || 5001;

// __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

// CORS setup
const allowedOrigins = process.env.FRONTEND_URLS && process.env.FRONTEND_URLS.trim() !== ''
  ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
  : ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request from origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/song", songRoutes);
app.use("/api/explore-premium", explorePremiumRoutes);
app.use("/api/chat", chatRoute);

// Serve static frontend (e.g., for production builds)
const frontendPath = path.join(__dirname, "/frontend/dist");
app.use(express.static(frontendPath));

// Fix to serve static assets like sw.js, favicon, etc.
app.get("*", (req, res, next) => {
  const ext = path.extname(req.path);
  if (ext) {
    return next(); // Let express.static handle files like sw.js
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Create HTTP server and Socket.IO
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join-session", ({ sessionId, user }) => {
    socket.join(sessionId);
    socket.to(sessionId).emit("user-joined", { user });
  });

  socket.on("play", ({ sessionId, time }) => {
    socket.to(sessionId).emit("play", { time });
  });

  socket.on("pause", ({ sessionId, time }) => {
    socket.to(sessionId).emit("pause", { time });
  });

  socket.on("seek", ({ sessionId, time }) => {
    socket.to(sessionId).emit("seek", { time });
  });

  socket.on("send-message", ({ sessionId, user, message }) => {
    io.to(sessionId).emit("receive-message", { user, message });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
