import express from "express";
import {sendMessageController,fetchMessagesController,deleteMessageController,markMessagesAsReadController,checkUnreadMessagesController} from "../controllers/chat.controller.js";
import { isAuthenticated } from "../middleware/user.authentication.middleware.js";
const router = express.Router();

router.post("/send", isAuthenticated, sendMessageController);
router.get("/:friendId", isAuthenticated, fetchMessagesController);
router.delete("/:messageId", isAuthenticated, deleteMessageController);
router.post("/:friendId/mark-read", isAuthenticated, markMessagesAsReadController);
router.get("/:friendId/check-unread", isAuthenticated, checkUnreadMessagesController);

export default router;