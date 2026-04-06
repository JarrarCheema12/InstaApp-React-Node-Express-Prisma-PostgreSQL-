import express from "express";
import { isAuthenticated } from "../middleware/user.authentication.middleware.js";
import { toggleLikePostController} from "../controllers/post.Like.Controller.js";

const router = express.Router();

router.post("/toggle-like", isAuthenticated, toggleLikePostController);


export default router;