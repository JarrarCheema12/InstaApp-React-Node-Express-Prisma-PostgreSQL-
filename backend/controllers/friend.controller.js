import * as friendService from "../services/friend.service.js";
import { io } from "../index.js";
export const sendFriendRequestController = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user;

    const success = await friendService.sendFriendRequestService(fromUserId, toUserId);

    if (success) {
      io.to(toUserId.toString()).emit('friend_request_received', {
        fromUserId
      })
    }

    return res.status(200).json({ success });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelFriendRequestController = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user;

    const success = await friendService.cancelFriendRequestService(fromUserId, toUserId);

    if (success) {
      io.to(toUserId.toString()).emit('friend_request_cancelled', {
        fromUserId
      })
    }

    return res.status(200).json({ success });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptFriendRequestController = async (req, res) => {
  try {
    const { fromUserId } = req.body;
    const toUserId = req.user;

    const success = await friendService.acceptFriendRequestService(fromUserId, toUserId);

    if (success) {
      io.to(fromUserId.toString()).emit('friend_request_accepted', {
        toUserId
      })
    }

    return res.status(200).json({ success });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectFriendRequestController = async (req, res) => {
  try {
    const { fromUserId } = req.body;
    const toUserId = req.user;

    const success = await friendService.rejectFriendRequestService(fromUserId, toUserId);

    if (success) {
      io.to(fromUserId.toString()).emit('friend_request_rejected', {
        toUserId
      })
    }

    return res.status(200).json({ success });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchFriendsController = async (req, res) => {
  try {
    const userId = req.user;
    const friends = await friendService.fetchFriendsService(userId);
    return res.status(200).json({ success: true, friends });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchUsersToAddFriendController = async (req, res) => {
  try {
    const userId = req.user;
    const friends = await friendService.fetchFriendsService(userId);
    const users = await friendService.fetchUsersToAddFriendService(userId, friends.map(f => f.id));
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const unFriendUserController = async (req, res) => {
  try {
    const userId = req.user;
    const { friendId } = req.body;

    const success = await friendService.unFriendUserService(userId, friendId);
    return res.status(200).json({ success });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchPendingRequestsController = async (req, res) => {
  try {
    const userId = req.user; // currently logged-in user
    const requests = await friendService.fetchPendingRequestsService(userId);
    return res.status(200).json({ success: true, requests });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};