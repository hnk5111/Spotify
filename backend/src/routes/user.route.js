import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages, searchUsers } from "../controller/user.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/", getAllUsers);
router.get("/search", searchUsers);
router.get("/messages/:userId", getMessages);

export default router;
