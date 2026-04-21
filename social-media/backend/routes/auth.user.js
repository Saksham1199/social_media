import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUserProfile , followUser , getSuggestedUsers , updateUserProfile} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUser);
router.post("/update", protectRoute, updateUserProfile);

export default router;