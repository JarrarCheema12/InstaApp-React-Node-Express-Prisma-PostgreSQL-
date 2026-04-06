import React from 'react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOneStoryThunk } from '../../store/storySlice'
const StoryDetails = () => {
  const dispatch = useDispatch()
  const { storyId } = useParams()

  const authUser = useSelector(state => state.auth.user);
  const story = useSelector(state => state.stories.singleStory);
  const loading = useSelector(state => state.stories.loading);

  useEffect(() => {
    const fetch = async () => {
      await dispatch(fetchOneStoryThunk({ storyId, authUser }));
    }
    fetch()
  }, [dispatch, storyId, authUser]);



  return loading ? (
    <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-white/40 text-base tracking-widest uppercase">Loading</span>
      </div>
    </div>
  ) : (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col">

      {/* Top Nav */}
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

      <main className="flex-1 flex justify-center px-4 md:px-6 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-[#111111] border border-white/[0.07] rounded-xl overflow-hidden">

            {story?.image_url && (
              <img
                src={story.image_url}
                alt="Story"
                className="w-full max-h-130 object-cover"
              />
            )}

            <div className="p-5 md:p-7 flex flex-col gap-4">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-base md:text-lg font-semibold uppercase shrink-0">
                  {story?.username?.[0]}
                </div>
                <span className="text-white/70 text-base md:text-lg font-medium">
                  {story?.username === authUser?.username ? "Me" : story?.username}
                </span>
              </div>

              <p className="text-white/85 text-base md:text-xl leading-relaxed">{story?.text}</p>

              {story?.user_id === authUser?.uid && (
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <span className="text-white/25 text-sm md:text-base">◎</span>
                  <span className="text-white/35 text-sm md:text-base font-medium">{story?.viewers_count} views</span>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

    </div>
  )
}

export default StoryDetails
