import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postsReducer from "./postSlice";
import friendsdReducer from "./friendSlice"
import chatsReducer from "./chatSlice"
import storiesReducer from "./storySlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsdReducer,
    posts: postsReducer,
    chat: chatsReducer,
    stories: storiesReducer
  },
});
