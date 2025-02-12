import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controller/notification.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/", getNotifications);
router.patch("/:notificationId/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:notificationId", deleteNotification);
router.delete("/", clearAllNotifications);

export default router; 