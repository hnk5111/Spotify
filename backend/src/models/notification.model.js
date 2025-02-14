import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Clerk user ID
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['message', 'friend_request', 'friend_request_response', 'system'], default: 'system' },
    metadata: {
      requestId: String,
      senderId: String,
      senderName: String,
      senderImage: String,
      // Keep it flexible for other notification types
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema); 