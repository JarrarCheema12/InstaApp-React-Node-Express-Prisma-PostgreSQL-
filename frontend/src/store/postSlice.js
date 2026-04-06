import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllPosts as fetchAllPostsService, createUserPost as createPostService, editUserPost as EditPostService, deleteUserPost as DeletePostService, fetchUserPosts as fetchMyPostsService, toggleUserLikePost as toggleLikePostService } from "../services/postService";


export const fetchAllPosts = createAsyncThunk(
  "users/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const res = await fetchAllPostsService();
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createUserPost = createAsyncThunk(
  "posts/createPost",
  async ({ formData }, thunkAPI) => {

    try {
      const res = await createPostService(formData);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const EditUserPost = createAsyncThunk(
  "posts/editPost",
  async ({ postId, newText }, thunkAPI) => {
    try {
      await EditPostService(postId, newText);
      return { postId, newText };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const DeleteUserPost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId }, thunkAPI) => {
    try {
      await DeletePostService(postId);
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchMyPosts",
  async (_, thunkAPI) => {
    try {
      const res = await fetchMyPostsService();
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const togglePostLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, thunkAPI) => {
    try {

      const res = await toggleLikePostService(postId);
      return {
        postId,
        is_liked: res.is_liked
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

  }
);


const postSlice = createSlice({
  name: "posts",
  initialState: {
    allPosts: [],
    myPosts: [],
    loading: true,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.allPosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(EditUserPost.fulfilled, (state, action) => {
        state.allPosts = state.allPosts.map(post =>
          post.id === action.payload.postId
            ? { ...post, text: action.payload.newText }
            : post
        );

        state.myPosts = state.myPosts.map(post =>
          post.id === action.payload.postId
            ? { ...post, text: action.payload.newText }
            : post
        );
      })
      .addCase(createUserPost.fulfilled, (state, action) => {
        if (action.payload) {
          state.allPosts.unshift(action.payload);
          state.myPosts.unshift(action.payload);
        }
      })
      .addCase(createUserPost.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(DeleteUserPost.fulfilled, (state, action) => {
        state.allPosts = state.allPosts.filter(post => post.id !== action.payload);
        state.myPosts = state.myPosts.filter(post => post.id !== action.payload);
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.myPosts = action.payload;
        state.loading = false;
      })
      .addCase(togglePostLike.fulfilled, (state, action) => {

        const updatePost = (post) => {
          if (!post) return post;

          if (post.id !== action.payload.postId) return post;

          const currentLikes = Number(post.likes_count) || 0;

          return {
            ...post,
            isLiked: action.payload.is_liked,
            likes_count: action.payload.is_liked
              ? currentLikes + 1
              : currentLikes - 1
          };
        };

        state.allPosts = state.allPosts.map(updatePost);
        state.myPosts = state.myPosts.map(updatePost);

      });
  }

});

export default postSlice.reducer; 