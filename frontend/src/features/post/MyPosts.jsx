import { Link } from "react-router-dom"
import { useEffect } from "react"
import Post from "./Post"
import { useSelector, useDispatch } from "react-redux"
import { fetchUserPosts, EditUserPost, DeleteUserPost } from "../../store/postSlice"

const MyPosts = () => {

  const dispatch = useDispatch()
  const authUser = useSelector(state => state.auth.user);
  const posts = useSelector(state => state.posts.myPosts)

  useEffect(() => {
    const getPosts = async () => {
      try {
        dispatch(fetchUserPosts())
      } catch (error) {
        console.log(error)
      }
    }

    getPosts()
  }, [])

  const handleDeletePost = async (postId) => {
    await dispatch(DeleteUserPost({ postId: postId }));
    toast.success("Post deleted Successfully")
  };
  const handleEditPost = async (postId, newText) => {
    await dispatch(EditUserPost({
      postId: postId,
      newText: newText
    }));

    toast.success("Post edited successfully");
  }
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col">

      <header className="w-full border-b border-white/6 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-1 md:gap-2">
          <Link
            to="/createPost"
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 text-base md:text-lg font-medium tracking-wide"
          >
            ✦ Create Post
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 text-base md:text-lg font-medium tracking-wide"
          >
            ← Home
          </Link>
        </div>
      </header>


      <main className="flex-1 flex justify-center px-4 md:px-6 py-8 md:py-12">
        <div className="w-full max-w-2xl flex flex-col gap-1">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-white/80 rounded-full" />
            <h1 className="text-white/80 text-base md:text-lg font-medium tracking-widest uppercase">Your Posts</h1>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-24 text-white/20 text-lg tracking-wider">
              You haven't posted anything yet.
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {posts.map((elem, index) => (
                <div
                  key={elem?.id ?? index}
                  className="opacity-0 animate-fadeIn"
                  style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
                >
                  <Post
                    elem={elem}
                    authUser={authUser}
                    onDelete={handleDeletePost}
                    onEdit={handleEditPost}
                  />
                </div>
              ))}
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
export default MyPosts