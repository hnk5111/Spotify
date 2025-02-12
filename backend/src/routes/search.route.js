import { Router } from "express";
import { searchSongs } from "../controller/search.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, searchSongs);

export default router; 