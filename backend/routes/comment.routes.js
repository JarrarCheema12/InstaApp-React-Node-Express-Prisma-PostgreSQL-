import express from "express";
import { isAuthenticated } from "../middleware/user.authentication.middleware.js";
import {
  createCommentController,
  deleteCommentController,
  fetchCommentsByPostController,
  toggleLikeCommentController,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", isAuthenticated, createCommentController);
router.get("/post/:postId", isAuthenticated, fetchCommentsByPostController);
router.delete("/:commentId", isAuthenticated, deleteCommentController);
router.post("/:commentId/toggle-like", isAuthenticated, toggleLikeCommentController);

export default router;

