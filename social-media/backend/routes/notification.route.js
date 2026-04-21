import express from "express";
const router = express.Router();
import { protectRoute } from "../middlewares/auth.middleware.js";
import {getAllNotifications , deleteNotification , deleteOneNotification} from "../controllers/notification.controller.js"

router.get("/", protectRoute, getAllNotifications)
router.delete("/", protectRoute, deleteNotification)
router.delete("/:id" , protectRoute, deleteOneNotification)

export default router;