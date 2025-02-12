import express from "express";
import { updateUserProfile, getUserProfile } from "../controller/user.controller.js";
import { auth } from "@clerk/clerk-sdk-node";

const router = express.Router();

// Profile management routes - protected by auth middleware
router.put("/profile/:clerkId", auth(), updateUserProfile);
router.get("/profile/:clerkId", auth(), getUserProfile);

export default router; 