import express from "express";
import {createStoryController,fetchStoriesController,deleteStoryController,fetchMyStoriesController,fetchSingleStoryController} from "../controllers/story.controller.js";
import { isAuthenticated } from "../middleware/user.authentication.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
const router = express.Router();

router.post("/create", isAuthenticated,upload.single("image"), createStoryController);

router.get("/all", isAuthenticated, fetchStoriesController);

router.get("/my", isAuthenticated, fetchMyStoriesController);

router.get("/:storyId", isAuthenticated, fetchSingleStoryController);

router.delete("/:storyId", isAuthenticated, deleteStoryController);

export default router;