import { toggleLikePost } from "../models/postLikeModel.js";

export const toggleLikePostService = async (postId, userId) => {
  
  return await toggleLikePost(postId, userId);
};

