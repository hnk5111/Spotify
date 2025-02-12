import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    senderId: { 
      type: String, 
      required: true,
      ref: 'User' 
    },
    receiverId: { 
      type: String, 
      required: true,
      ref: 'User'  
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema); 