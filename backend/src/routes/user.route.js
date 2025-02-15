import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages, searchUsers, getUserProfile, updateUserProfile } from "../controller/user.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/", getAllUsers);
router.get("/search", searchUsers);
router.get("/messages/:userId", getMessages);
router.get("/profile/:userId", getUserProfile);
router.put("/profile/:clerkId", updateUserProfile);

export default router;
