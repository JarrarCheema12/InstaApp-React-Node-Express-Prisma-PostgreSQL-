import { Navbar } from "../../components/Navbar"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import Story from "./Story"
import { useSelector, useDispatch } from "react-redux"
import { fetchMyStoriesThunk, deleteStoryThunk } from "../../store/storySlice.js"
import { useNavigate } from "react-router-dom"
import MyStoriesHandler from "./MyStoriesHandler"
const MyStories = () => {

  const dispatch = useDispatch()
  const authUser = useSelector(state => state.auth.user);
  const stories = useSelector(state => state.stories.myStories)
  const loading = useSelector(state => state.stories.loading)


  useEffect(() => {
    const getStories = async () => {
      try {
        dispatch(fetchMyStoriesThunk(authUser.uid))
      } catch (error) {
        console.log(error)
      }
    }

    getStories()
  }, [dispatch])

  const navigate = useNavigate();

  const handleStoryDelete = async () => {

    try {
      await dispatch(deleteStoryThunk(elem.id));
      toast.success("Story deleted Successfully")
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }
  return loading ? (
    <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-white/40 text-base tracking-widest uppercase">Loading</span>
      </div>
    </div>
  ) : (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col">

      <header className="w-full border-b border-white/6 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-1 md:gap-2">
          <Link
            to="/createStory"
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 text-base md:text-lg font-medium tracking-wide"
          >
            ✦ Create Story
          </Link>
          <Link
            to="/Story"
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 text-base md:text-lg font-medium tracking-wide"
          >
            ◇ Stories
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 text-base md:text-lg font-medium tracking-wide ml-auto"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">

          <div className="mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-white/80 rounded-full" />
            <h1 className="text-white/80 text-base md:text-lg font-medium tracking-widest uppercase">My Stories</h1>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-24 text-white/20 text-lg tracking-wider">
              You haven't posted anything yet
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {stories.map((elem, index) => (
                <div
                  key={elem.id}
                  className="opacity-0 animate-fadeIn"
                  style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'forwards' }}
                >
                  <MyStoriesHandler elem={elem} authUser={authUser} />
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
export default MyStories