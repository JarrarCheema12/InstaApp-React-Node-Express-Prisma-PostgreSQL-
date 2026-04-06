import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";

import Signup from "../features/auth/Signup";
import Login from "../features/auth/Login";
import HomePage from "../components/HomePage";
import CreatePost from "../features/post/CreatePost";
import MyPosts from "../features/post/MyPosts";
import AddFriends from "../features/friends/AddFriends";
import PendingFriendRequest from "../features/friends/PendingFriendRequest";
import MyFriends from "../features/friends/MyFriends";
import Chat from "../features/chat/Chat";
import ViewAllStories from "../features/stories/ViewAllStories";
import CreateStory from "../features/stories/CreateStory";
import MyStories from "../features/stories/MyStories";
import StoryDetails from "../features/stories/StoryDetails";
import EnterEmail from "../features/auth/EnterEmail";
export const Router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute><HomePage /></ProtectedRoute>
      },
      {
        path: "/register",
        element: <PublicRoute><EnterEmail /></PublicRoute>
      },
      {
        path: "/verifyUser/:token",
        element: <PublicRoute><Signup /></PublicRoute>
      },

      {
        path: "/signup/:id",
        element: <PublicRoute><Signup /></PublicRoute>

      },

      {
        path: "/signup",
        element: <ProtectedRoute><Signup /></ProtectedRoute>

      },
      {
        path: "/login",
        element: <PublicRoute><Login /></PublicRoute>
      },
      {
        path: "/createPost",
        element: <ProtectedRoute><CreatePost /></ProtectedRoute>
      },
      {
        path: "/myPosts",
        element: <ProtectedRoute><MyPosts /></ProtectedRoute>
      },
      {
        path: "/addFriends",
        element: <ProtectedRoute><AddFriends /></ProtectedRoute>
      },
      {
        path: "/pendingFriendRequests",
        element: <ProtectedRoute><PendingFriendRequest /></ProtectedRoute>

      },
      {
        path: "/myFriends",
        element: <ProtectedRoute><MyFriends /></ProtectedRoute>

      },
      {
        path: "/chatFriend/:id",
        element: <ProtectedRoute><Chat /></ProtectedRoute>

      },
      {
        path: "/Story",
        element: <ProtectedRoute><ViewAllStories /></ProtectedRoute>
      },
      {
        path: "/createStory",
        element: <ProtectedRoute><CreateStory /></ProtectedRoute>
      },
      {
        path: "/myStories",
        element: <ProtectedRoute><MyStories /></ProtectedRoute>
      },
      {
        path: "/story/:storyId",
        element: <ProtectedRoute><StoryDetails /></ProtectedRoute>
      },
    ],
    errorElement: <h1>No such page exists</h1>

  }
])