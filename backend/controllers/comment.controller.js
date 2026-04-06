import {
  createCommentService,
  deleteCommentService,
  fetchCommentsByPostService,
  toggleLikeCommentService,
} from "../services/comment.service.js";

export const createCommentController = async (req, res) => {
  try {
    const userId = req.user;
    const { postId, text } = req.body;

    if (!postId || !text?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "postId and text are required" });
    }

    const comment = await createCommentService({
      postId: Number(postId),
      userId: Number(userId),
      text: text.trim(),
    });

    return res.status(201).json({ success: true, comment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchCommentsByPostController = async (req, res) => {
  try {
    const userId = req.user;
    const { postId } = req.params;

    const comments = await fetchCommentsByPostService({
      postId: Number(postId),
      userId: Number(userId),
    });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCommentController = async (req, res) => {
  try {
    const requesterUserId = req.user;
    const { commentId } = req.params;

    await deleteCommentService({
      commentId: Number(commentId),
      requesterUserId: Number(requesterUserId),
    });

    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const toggleLikeCommentController = async (req, res) => {
  try {
    const userId = req.user;
    const { commentId } = req.params;

    const result = await toggleLikeCommentService({
      commentId: Number(commentId),
      userId: Number(userId),
    });

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

