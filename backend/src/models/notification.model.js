import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Clerk user ID
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['message', 'system'], default: 'system' },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema); 