import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware, ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

// Route imports
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.routes.js"; // Fixed extension
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import searchRoutes from "./routes/search.route.js";
import notificationRoutes from "./routes/notification.route.js";
import friendRoutes from "./routes/friend.route.js";
import chatRoutes from "./routes/chat.route.js";
import healthRoutes from "./routes/health.route.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize socket
initializeSocket(httpServer);

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? "https://spotify-hdw7.onrender.com"
      : ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type", 
      "Authorization",
      "Connection",
      "Upgrade",
      "Sec-WebSocket-Key",
      "Sec-WebSocket-Version"
    ],
  })
);

// Enable pre-flight requests
app.options('*', cors());

// Basic middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.raw({ type: 'application/json' })); // For webhook raw bodies

// Clerk middleware - but NOT for webhook route
app.use((req, res, next) => {
  if (req.path === '/api/auth/webhook') {
    return next();
  }
  return clerkMiddleware()(req, res, next);
});

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  })
);

// Auth routes (no auth required)
app.use("/api/auth", authRoutes);
app.use("/health", healthRoutes);

// Protected routes (auth required)
app.use("/api/*", ClerkExpressWithAuth(), (req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// Protected API routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/chat", chatRoutes);

// Temporary files cleanup cron job
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.error("❌ Error cleaning temp files:", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {
          if (err) console.error(`❌ Error deleting ${file}:`, err);
        });
      }
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  // Handle client-side routing
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    error: "Server error",
    message: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
