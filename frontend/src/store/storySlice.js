import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserStory,
  fetchUserStories,
  deleteUserStory,
  fetchSingleUserStories,
  fetchUserSingleStory
} from "../services/storyService.js";

export const fetchAllStories = createAsyncThunk(
  "stories/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await fetchUserStories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createStoryThunk = createAsyncThunk(
  "stories/create",
  async ({ formData }, thunkAPI) => {
    try {

      const res = await createUserStory(formData);
      return res

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteStoryThunk = createAsyncThunk(
  "stories/delete",
  async ({ storyId }, thunkAPI) => {
    try {
      await deleteUserStory(storyId);
      return storyId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchMyStoriesThunk = createAsyncThunk(
  "stories/myStories",
  async (_, thunkAPI) => {
    try {
      return await fetchSingleUserStories();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchOneStoryThunk = createAsyncThunk(
  "stories/single",
  async ({ storyId }, thunkAPI) => {
    try {
      return await fetchUserSingleStory(storyId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const storySlice = createSlice({
  name: "stories",
  initialState: {
    allStories: [],
    myStories: [],
    singleStory: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllStories.fulfilled, (state, action) => {
        state.allStories = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllStories.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(createStoryThunk.fulfilled, (state, action) => {
        state.allStories.unshift(action.payload);
        state.myStories.unshift(action.payload);
      })
      .addCase(createStoryThunk.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })

      .addCase(deleteStoryThunk.fulfilled, (state, action) => {
        state.allStories = state.allStories.filter(
          (story) => story.id !== action.payload
        );
        state.myStories = state.myStories.filter(
          (story) => story.id !== action.payload
        );
      })

      .addCase(fetchMyStoriesThunk.fulfilled, (state, action) => {
        state.myStories = action.payload;
      })

      .addCase(fetchOneStoryThunk.fulfilled, (state, action) => {
        state.singleStory = action.payload;
      });
  }
});

export default storySlice.reducer;