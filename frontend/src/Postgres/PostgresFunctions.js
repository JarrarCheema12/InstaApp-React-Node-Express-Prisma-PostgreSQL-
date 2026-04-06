import axios from "axios";

const API = "http://localhost:5000/api/v1/posts";
const API2 = "http://localhost:5000/api/v1/post-likes"


export const createPost = async (formData) => {
  try {
    const res = await axios.post(
      `${API}/create`,
      formData,
      {
        withCredentials: true,
      }
    );
    return res.data.post;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const fetchPosts = async () => {
  try {
    const res = await axios.get(`${API}/all`, {
      withCredentials: true,
    });
    return res.data.posts;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const res = await axios.delete(`${API}/delete`, {
      data: { postId },
      withCredentials: true,
    });
    return res.data.message;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const editPost = async (postId, newText) => {
  try {
    const res = await axios.put(
      `${API}/edit`,
      { postId, newText },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res.data.message;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const fetchMyPosts = async () => {
  try {
    const res = await axios.get(`${API}/my`, {
      withCredentials: true,
    });
    return res.data.posts;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const toggleLikePost = async (postId) => {
  try {
    const res = await axios.post(`${API2}/toggle-like`, {
      postId: Number(postId)

    }, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
}

export const addComment = async ({ postId, text }, API) => {
  try {
    const res = await axios.post(
      `${API}/create`,
      { postId, text },
      { withCredentials: true }
    );
    return res
  } catch (error) {
    console.log(error);

  }
}

export const fetchComments = async (postId, API) => {
  try {
    const res = await axios.get(`${API}/post/${postId}`, {
      withCredentials: true,
    });
    return res
  } catch (error) {
    console.log(error);

  }
}
export const deleteUserComment = async (commentId, API) => {
  try {
    const res = await axios.delete(`${API}/${commentId}`, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.log(error);

  }
};

export const toggleUserLikeComment = async (commentId, API) => {
  try {
    const res = await axios.post(
      `${API}/${commentId}/toggle-like`,
      {},
      { withCredentials: true }
    );
    return res;
  } catch (error) {
    console.log(error);

  }
}

export const fetchUsersToAddFriend = async (API) => {
  try {
    const res = await axios.get(`${API}/users-to-add`, {
      withCredentials: true,
    });
    return res.data.users;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return [];
  }
};

export const sendFriendRequest = async (toUserId, API) => {
  try {
    const res = await axios.post(
      `${API}/send`,
      { toUserId },
      { withCredentials: true }
    );
    return res.data.success;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return false;
  }
};

export const cancelFriendRequest = async (toUserId, API) => {
  try {
    const res = await axios.post(
      `${API}/cancel`,
      { toUserId },
      { withCredentials: true }
    );
    return res.data.success;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return false;
  }
};

export const fetchPendingRequests = async (API) => {
  try {
    const res = await axios.get(`${API}/pending`, {
      withCredentials: true,
    });
    return res.data.requests;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return [];
  }
};

export const acceptFriendRequest = async (fromUserId, API) => {
  try {
    const res = await axios.post(
      `${API}/accept`,
      { fromUserId },
      { withCredentials: true }
    );
    return res.data.success;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return false;
  }
};

export const rejectFriendRequest = async (fromUserId, API) => {
  try {
    const res = await axios.post(
      `${API}/reject`,
      { fromUserId },
      { withCredentials: true }
    );
    return res.data.success;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return false;
  }
};


export const fetchFriends = async (API) => {
  try {
    const res = await axios.get(`${API}/friends`, {
      withCredentials: true,
    });
    return res.data.friends;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return [];
  }
};


export const unFriendUser = async (friendId, API) => {
  try {
    const res = await axios.post(
      `${API}/unfriend`,
      { friendId },
      { withCredentials: true }
    );
    return res.data.success;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return false;
  }
}

export const sendMessage = async (friendId, text, API) => {
  try {
    const res = await axios.post(
      `${API}/send`,
      {
        friendId: Number(friendId),
        text: text,
      },
      { withCredentials: true }
    );

    return res.data.message;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const fetchUserMessages = async (friendId, API) => {
  try {
    const res = await axios.get(`${API}/${friendId}`, {
      withCredentials: true,
    });
    return res.data.messages;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};



export const deleteMessage = async (messageId, API) => {
  try {
    const res = await axios.delete(`${API}/${messageId}`, {
      withCredentials: true,
    });
    return res.data.success;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }

}

export const markMessagesAsRead = async (friendId, API) => {
  try {
    const res = await axios.post(`${API}/${friendId}/mark-read`, {}, {
      withCredentials: true,
    });
    return res.data.success;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};


export const checkUnreadMessages = async (friendId, API) => {
  try {
    const res = await axios.get(
      `${API}/${friendId}/check-unread`,
      {
        withCredentials: true,
      }
    );
    return res.data.hasUnread;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    return false;
  }
};



export const createStory = async (formData, API) => {

  const res = await axios.post(
    `${API}/create`,
    formData,
    { withCredentials: true }
  );
  return res.data.story;
};

export const fetchStories = async (API) => {
  const res = await axios.get(`${API}/all`, {
    withCredentials: true
  });
  return res.data.stories;
};

export const fetchMyStories = async (API) => {
  const res = await axios.get(`${API}/my`, {
    withCredentials: true
  });
  return res.data.stories;
};

export const fetchSingleStory = async (storyId, API) => {
  const res = await axios.get(`${API}/${storyId}`, {
    withCredentials: true
  });
  return res.data.story;
};

export const deleteStory = async (storyId, API) => {
  const res = await axios.delete(`${API}/${storyId}`, {
    withCredentials: true
  });
  return res.data;
};

const convertTimestamp = (timestamp) => {
  if (!timestamp) return null;

  if (typeof timestamp.toMillis === "function") {
    return timestamp.toMillis();
  }

  if (typeof timestamp === "number") {
    return timestamp;
  }


  if (typeof timestamp === "string") {
    return new Date(timestamp).getTime();
  }

  return null;
};
