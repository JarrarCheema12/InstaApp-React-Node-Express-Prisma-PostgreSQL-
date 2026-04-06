import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { createUserPost } from "../../store/postSlice";

const CreatePost = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [postText, setPostText] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const loading = useSelector(state => state.posts.loading);

    const handleCreatePost = async () => {
        if (postText.trim() === "") {
            toast.error("Post is empty");
            return;
        }

        const formData = new FormData();
        formData.append("text", postText);
        if (imageFile) formData.append("image", imageFile);


        const resultAction = await dispatch(createUserPost({ formData }));

        if (createUserPost.fulfilled.match(resultAction)) {
            toast.success("Post Created Successfully");
            navigate("/");
        } else {

            toast.error(resultAction.payload || "Something went wrong");
        }

    };

    return (
        <div className="w-full min-h-screen bg-[#0a0a0a] flex justify-center px-4 md:px-6 py-8 md:py-12">
            <div className="w-full max-w-2xl flex flex-col gap-6">

                <div className="mb-2 flex items-center gap-3">
                    <div className="w-1 h-6 bg-white/80 rounded-full" />
                    <h1 className="text-white/80 text-base md:text-lg font-medium tracking-widest uppercase">Create Post</h1>
                </div>

                <div className="bg-[#111111] border border-white/[0.07] rounded-xl p-5 md:p-7 flex flex-col gap-5">

                    <div className="flex flex-col gap-2">
                        <label className="text-white/40 text-sm md:text-base font-medium tracking-wide">Content</label>
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="What's on your mind?"
                            rows={4}
                            className="w-full bg-white/4 border border-white/8 rounded-lg px-4 py-3 text-white/80 text-base md:text-lg placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-white/40 text-sm md:text-base font-medium tracking-wide">Image</label>
                        <label className="flex items-center gap-3 w-full bg-white/4 border border-white/8 border-dashed rounded-lg px-4 py-4 cursor-pointer hover:border-white/20 hover:bg-white/6 transition-all duration-200 group">
                            <span className="text-white/25 group-hover:text-white/50 transition-colors text-lg">⊕</span>
                            <span className="text-white/40 group-hover:text-white/60 text-base md:text-lg transition-colors">
                                {imageFile ? imageFile.name : "Choose an image..."}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <button
                        onClick={handleCreatePost}
                        disabled={loading}
                        className="w-full mt-1 py-3 md:py-3.5 rounded-lg text-base md:text-lg font-medium transition-all duration-200 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : "Create Post"}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default CreatePost;