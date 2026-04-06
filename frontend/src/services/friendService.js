import { unFriendUser, fetchFriends, fetchPendingRequests, sendFriendRequest, rejectFriendRequest, acceptFriendRequest, cancelFriendRequest, fetchUsersToAddFriend, checkUnreadMessages } from "../Postgres/PostgresFunctions";

const API = "http://localhost:5000/api/v1/friends";
const API2 = "http://localhost:5000/api/v1/chats";


export const FriendsThatUserCanAdd = async () => {
    try {
        return await fetchUsersToAddFriend(API)
    } catch (error) {
        console.log(error);
    }
};

export const sendUserFriendRequest = async (fromUserId, toUserId) => {
    try {
        return await sendFriendRequest(toUserId, API)
    } catch (error) {
        console.error("Error sending friend request:", error);
    }
};

export const cancelUserFriendRequest = async (fromUserId, toUserId) => {
    try {
        return await cancelFriendRequest(toUserId, API)
    } catch (error) {
        console.log(error);
    }
};

export const fetchUserPendingRequests = async (userId) => {
    try {
        return await fetchPendingRequests(API)
    } catch (error) {
        console.error("Error fetching pending requests:", error);
    }
};

export const acceptUserFriendRequest = async (fromUserId, toUserId) => {
    try {
        return await acceptFriendRequest(fromUserId, API)
    } catch (error) {
        console.error("Error accepting friend request:", error);
    }
};

export const rejectUserFriendRequest = async (fromUserId, toUserId) => {
    try {
        return await rejectFriendRequest(fromUserId, API)
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        return false;
    }
};

export const fetchUserFriends = async (authUserId) => {

    try {
        return await fetchFriends(API)
    } catch (error) {
        console.error("Error fetching friends:", error);
    }
};


export const removeUserFriend = async (userId, friendId) => {
    try {
        return await unFriendUser(friendId, API)
    } catch (error) {
        console.log(error);

    }
}

export const checkUserUnreadMessages = async (uid, friendId) => {
    try {
        return await checkUnreadMessages(friendId, API2)
    } catch (error) {
        console.log(error);
    }
}


