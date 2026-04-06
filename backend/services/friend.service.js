import * as friendQuery from "../models/friendModel.js";

export const sendFriendRequestService = async (fromUserId, toUserId) => {
  return await friendQuery.sendFriendRequest(fromUserId, toUserId);
};

export const cancelFriendRequestService = async (fromUserId, toUserId) => {
  return await friendQuery.cancelFriendRequest(fromUserId, toUserId);
};

export const acceptFriendRequestService = async (fromUserId, toUserId) => {
  return await friendQuery.acceptFriendRequest(fromUserId, toUserId);
};

export const rejectFriendRequestService = async (fromUserId, toUserId) => {
  return await friendQuery.rejectFriendRequest(fromUserId, toUserId);
};

export const fetchFriendsService = async (userId) => {
  return await friendQuery.fetchFriends(userId);
};

export const fetchUsersToAddFriendService = async (userId, currentFriends) => {
  return await friendQuery.fetchUsersToAddFriend(userId, currentFriends);
};

export const unFriendUserService = async (userId, friendId) => {
  return await friendQuery.unFriendUser(userId, friendId);
};

export const fetchPendingRequestsService = async (userId) => {
  return await friendQuery.fetchPendingRequests(userId);
};