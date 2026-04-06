import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FriendsThatUserCanAdd as fetchAllUsersService, sendUserFriendRequest as sendFriendRequestService, cancelUserFriendRequest as cancelFriendRequestService, fetchUserPendingRequests as fetchPendingRequestsService, acceptUserFriendRequest as acceptFriendRequestService, rejectUserFriendRequest as rejectFriendRequestService, fetchUserFriends as fetchFriendsService, removeUserFriend as unFriendUserService, checkUserUnreadMessages as checkUserUnreadMessagesService } from "../services/friendService";


export const fetchUsers = createAsyncThunk(
  "friends/fetchUsers",
  async ({ currentUserId, currentFriends }, thunkAPI) => {
    try {
      return await fetchAllUsersService();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const sendFriendRequestToUser = createAsyncThunk(
  "friends/sendFriendRequest",
  async ({ fromUserId, toUserId }, thunkAPI) => {
    try {
      return await sendFriendRequestService(fromUserId, toUserId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const cancelFriendRequestToUser = createAsyncThunk(
  "friends/cancelFriendRequest",
  async ({ fromUserId, toUserId }, thunkAPI) => {
    try {
      return await cancelFriendRequestService(fromUserId, toUserId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserPendingRequests = createAsyncThunk(
  "friends/fetchUserPendingRequest",
  async (uid, thunkAPI) => {
    try {
      return await fetchPendingRequestsService(uid);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const acceptUserFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async ({ fromUserId, toUserId }, thunkAPI) => {
    try {
      return await acceptFriendRequestService(fromUserId, toUserId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const rejectUserFriendRequest = createAsyncThunk(
  "friends/rejectFriendRequest",
  async ({ fromUserId, toUserId }, thunkAPI) => {
    try {
      return await rejectFriendRequestService(fromUserId, toUserId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const removeUserFriend = createAsyncThunk(
  "friends/removeUserFriend",
  async ({ user, friendId }, thunkAPI) => {
    try {
      return await unFriendUserService(user, friendId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserFriendsWithUnread = createAsyncThunk(
  "friends/fetchUserFriendsWithUnread",
  async (uid, thunkAPI) => {
    try {
      const friends = await fetchFriendsService(uid);

      const friendsWithUnread = await Promise.all(
        friends.map(async (friend) => {
          const hasUnread = await checkUserUnreadMessagesService(uid, friend.id);
          return { ...friend, hasUnread };
        })
      );

      return friendsWithUnread;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const friendSlice = createSlice({
  name: "friends",
  initialState: {
    friends: [],          // accepted friends
    availableUsers: [],    //jinko mai add krskta
    pendingRequests: [],  // received friend requests
    sentRequests: [],     // requests sent by authUser
    loading: true
  },
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
      state.loading = false;
    },
    setPendingRequests: (state, action) => {
      state.pendingRequests = action.payload
      state.loading = false
    },
    setAvailableUsers: (state, action) => {
      state.availableUsers = action.payload;
      state.loading = false;
    },
    markRequestSent: (state, action) => {
      state.availableUsers = state.availableUsers.map(user =>
        user.id === action.payload
          ? { ...user, requestSent: true }
          : user
      );

      state.sentRequests.push(action.payload);

    },
    unmarkRequestSent: (state, action) => {
      state.availableUsers = state.availableUsers.map(user =>
        user.id === action.payload
          ? { ...user, requestSent: false }
          : user
      );

      state.sentRequests = state.sentRequests.filter(
        id => id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.availableUsers = action.payload;
      state.loading = false;
    })
    builder.addCase(fetchUserPendingRequests.fulfilled, (state, action) => {
      state.pendingRequests = action.payload;
      state.loading = false;
    })
    builder.addCase(acceptUserFriendRequest.fulfilled, (state, action) => {
      const fromUserId = action.meta.arg.fromUserId;
      state.pendingRequests = state.pendingRequests.filter(r => r.from !== fromUserId);
      state.loading = false;
    });
    builder.addCase(rejectUserFriendRequest.fulfilled, (state, action) => {
      const fromUserId = action.meta.arg.fromUserId;
      state.pendingRequests = state.pendingRequests.filter(r => r.from !== fromUserId);
      state.loading = false;
    });
    builder.addCase(removeUserFriend.fulfilled, (state, action) => {
      const friendId = action.meta.arg.friendId;
      state.friends = state.friends.filter(friend => friend.id !== friendId);
      state.loading = false;
    });
    builder.addCase(fetchUserFriendsWithUnread.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchUserFriendsWithUnread.fulfilled, (state, action) => {
      state.friends = action.payload;
      state.loading = false;
    });



  }
})

export const { setFriends, setPendingRequests, setAvailableUsers, markRequestSent,
  unmarkRequestSent } = friendSlice.actions;
export default friendSlice.reducer; 