import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  likeOnPost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.get("/likes", protectRoute, getLikedPosts);
router.post("/", protectRoute, createPost);

router.delete("/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/like/:id", protectRoute, likeOnPost);
export default router;
 