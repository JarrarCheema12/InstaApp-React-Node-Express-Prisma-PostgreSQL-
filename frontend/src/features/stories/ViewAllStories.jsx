import React, { useEffect } from "react";
import Story from "./Story";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllStories } from "../../store/storySlice";

const ViewAllStories = () => {

  const dispatch = useDispatch();

  const { allStories, loading } = useSelector((state) => state.stories);
  const authUser = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(fetchAllStories());
  }, [dispatch]);

  if (loading) return <h1>Loading...</h1>;

  return (
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
            to="/myStories"
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 text-base md:text-lg font-medium tracking-wide"
          >
            ◈ My Stories
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
            <h1 className="text-white/80 text-base md:text-lg font-medium tracking-widest uppercase">Stories</h1>
          </div>

          {allStories.length === 0 ? (
            <div className="text-center py-24 text-white/20 text-lg tracking-wider">
              No stories posted yet
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {allStories.map((story, index) => (
                <Link
                  key={story.id}
                  to={`/story/${story.id}`}
                  className="opacity-0 animate-fadeIn group block rounded-xl overflow-hidden border border-white/[0.07] hover:border-white/18 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'forwards' }}
                >
                  <Story elem={story} authUser={authUser} />
                </Link>
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

export default ViewAllStories;