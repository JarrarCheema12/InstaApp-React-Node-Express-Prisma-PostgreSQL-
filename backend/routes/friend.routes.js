import express from "express";
import { isAuthenticated } from "../middleware/user.authentication.middleware.js";
import {
  sendFriendRequestController,
  cancelFriendRequestController,
  acceptFriendRequestController,
  rejectFriendRequestController,
  fetchFriendsController,
  fetchUsersToAddFriendController,
  unFriendUserController,
  fetchPendingRequestsController
  
} from "../controllers/friend.controller.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendFriendRequestController);
router.post("/cancel", isAuthenticated, cancelFriendRequestController);
router.get("/pending", isAuthenticated, fetchPendingRequestsController);
router.post("/accept", isAuthenticated, acceptFriendRequestController);
router.post("/reject", isAuthenticated, rejectFriendRequestController);
router.get("/friends", isAuthenticated, fetchFriendsController);
router.get("/users-to-add", isAuthenticated, fetchUsersToAddFriendController);
router.post("/unfriend", isAuthenticated, unFriendUserController);

export default router;