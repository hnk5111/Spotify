import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  sendFriendRequest, 
  respondToFriendRequest, 
  getFriends,
  getPendingRequests,
  getFriendshipStatus
} from "../controller/friend.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/request", sendFriendRequest);
router.put("/request/:requestId", respondToFriendRequest);
router.get("/", getFriends);
router.get("/pending", getPendingRequests);
router.get("/status/:targetUserId", getFriendshipStatus);

export default router; 