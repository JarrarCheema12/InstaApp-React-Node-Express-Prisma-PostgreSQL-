import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Post from "../features/post/Post"
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllPosts } from "../store/postSlice"
import toast from "react-hot-toast"
import { fetchUserPendingRequests } from '../store/friendSlice';
import { socket } from "../socket.js"

const navLinks = [
  { to: "/createPost", label: "Create Post", icon: "✦" },
  { to: "/myPosts", label: "My Posts", icon: "◈" },
  { to: "/addFriends", label: "Add Friends", icon: "⊕" },
  { to: "/myFriends", label: "My Friends", icon: "◎" },
  { to: "/Story", label: "Stories", icon: "◇" },
]

const HomePage = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.auth.user);
  const posts = useSelector(state => state.posts.allPosts ?? []);
  const loading = useSelector(state => state.posts.loading);
  const pendingCount = useSelector((state) => state.friends.pendingRequests.length)

  useEffect(() => {
    const getPosts = async () => {
      await dispatch(fetchAllPosts())
      await dispatch(fetchUserPendingRequests(authUser.id))
    }
    getPosts()
  }, [dispatch])

  useEffect(() => {
    if (!authUser) return;
    socket.emit("join", authUser.id.toString());

    const handleSentFriendRequest = async (data) => {
      await dispatch(fetchUserPendingRequests(authUser.id));
      toast.success("You have a new friend request!");
    };
    const handleCancelFriendRequest = async (data) => {
      await dispatch(fetchUserPendingRequests(authUser.id));
    };

    socket.on("friend_request_received", handleSentFriendRequest);
    socket.on("friend_request_cancelled", handleCancelFriendRequest);

    return () => {
      socket.off("friend_request_received", handleSentFriendRequest);
      socket.off("friend_request_cancelled", handleCancelFriendRequest);
    };
  }, [authUser, dispatch]);

  if (loading) return (
    <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-white/40 text-base tracking-widest uppercase">Loading</span>
      </div>
    </div>
  )

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col">

      <header className="w-full border-b border-white/6 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-1 md:gap-2 flex-wrap">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 text-base md:text-lg font-medium tracking-wide"
            >
              <span className="text-white/20 group-hover:text-white/60 transition-colors text-sm hidden md:inline">{icon}</span>
              {label}
            </Link>
          ))}

          <Link
            to="/pendingFriendRequests"
            className="group relative flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 text-base md:text-lg font-medium tracking-wide ml-auto"
          >
            <span className="text-white/20 group-hover:text-white/60 transition-colors text-sm hidden md:inline">⊛</span>
            Friend Requests
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 leading-none">
                {pendingCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="flex-1 flex justify-center px-4 md:px-6 py-8 md:py-12">
        <div className="w-full max-w-2xl flex flex-col gap-1">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-white/80 rounded-full" />
            <h1 className="text-white/80 text-base md:text-lg font-medium tracking-widest uppercase">Recent Posts</h1>
          </div>

          <div className="flex flex-col gap-5">
            {posts.filter(Boolean).map((elem, index) => (
              <div
                key={elem?.id ?? index}
                className="opacity-0 animate-fadeIn"
                style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
              >
                <Post elem={elem} authUser={authUser} />
              </div>
            ))}
          </div>

          {posts.filter(Boolean).length === 0 && (
            <div className="text-center py-24 text-white/20 text-lg tracking-wider">
              No posts yet
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
      `}</style>
    </div>
  )
}

export default HomePage