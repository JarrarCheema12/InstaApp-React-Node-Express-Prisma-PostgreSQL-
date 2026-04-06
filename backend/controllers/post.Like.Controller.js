import { toggleLikePostService } from "../services/post.Like.Service.js";

export const toggleLikePostController = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user;



    const result = await toggleLikePostService(postId, userId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

