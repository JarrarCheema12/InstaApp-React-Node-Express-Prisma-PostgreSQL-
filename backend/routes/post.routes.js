import express from "express"
import {createPost,fetchPosts,fetchMyPosts,editPost,deletePost} from "../controllers/post.controller.js"
import { isAuthenticated } from "../middleware/user.authentication.middleware.js"
import { upload } from "../middleware/upload.middleware.js"
const router = express.Router()

router.post("/create", isAuthenticated,upload.single("image"), createPost);
router.get("/all", isAuthenticated, fetchPosts);
router.get("/my", isAuthenticated, fetchMyPosts);
router.put("/edit", isAuthenticated, editPost);
router.delete("/delete", isAuthenticated, deletePost);

export default router