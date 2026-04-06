import { useState } from "react"
import toast from "react-hot-toast"
import { deleteStoryThunk } from "../../store/storySlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
const MyStoriesHandler = ({ elem, authUser }) => {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handleStoryDelete = async () => {

    try {
      await dispatch(deleteStoryThunk({ storyId: elem.id }));
      toast.success("Story deleted Successfully")
      navigate("/Story")
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="bg-[#111111] border border-white/[0.07] rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:border-white/[0.14] group">

      {elem.image_url && (
        <img
          src={elem.image_url}
          alt="Story"
          className="w-full max-h-55] object-cover"
        />
      )}

      <div className="p-4 md:p-5 flex flex-col gap-3">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-semibold uppercase shrink-0">
              {authUser?.username?.[0]}
            </div>
            <span className="text-white/70 text-sm md:text-base font-medium">
              {elem.user_id === authUser.id ? "Me" : authUser.username}
            </span>
          </div>

          {authUser && authUser.uid === elem.user_id && (
            <button
              onClick={handleStoryDelete}
              className="text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 px-2 py-1 rounded-lg text-sm md:text-base font-medium"
            >
              ✕
            </button>
          )}
        </div>

        {elem.text && (
          <p className="text-white/75 text-sm md:text-base leading-relaxed line-clamp-3">{elem.text}</p>
        )}

      </div>
    </div>
  )
}
export default MyStoriesHandler
