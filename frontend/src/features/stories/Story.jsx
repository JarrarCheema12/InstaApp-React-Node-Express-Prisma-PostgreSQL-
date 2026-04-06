import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
const Story = ({ elem, authUser }) => {

  return (
    <div className="bg-[#111111] border border-white/[0.07] rounded-xl p-5 md:p-6 flex flex-col gap-3 transition-all duration-200 hover:border-white/[0.14]">

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-base md:text-lg font-semibold uppercase shrink-0">
          {elem.username?.[0]}
        </div>
        <span className="text-white/70 text-base md:text-lg font-medium">
          {elem.user_id === authUser.uid ? "Me" : elem.username}
        </span>
      </div>

      <p className="text-white/85 text-base md:text-lg leading-relaxed">{elem.text}</p>

      {elem.image_url && (
        <img
          src={elem.image_url}
          alt="Post"
          className="w-full max-h-120 object-cover rounded-lg border border-white/[0.07]"
        />
      )}

    </div>
  )
}
export default Story
