import {
  createComment,
  deleteComment,
  fetchCommentsByPost,
  toggleLikeComment,
} from "../models/commentModel.js";

export const createCommentService = async ({ postId, userId, text }) => {
  return await createComment({ postId, userId, text });
};

export const fetchCommentsByPostService = async ({ postId, userId }) => {
  return await fetchCommentsByPost({ postId, userId });
};

export const deleteCommentService = async ({ commentId, requesterUserId }) => {
  return await deleteComment({ commentId, requesterUserId });
};

export const toggleLikeCommentService = async ({ commentId, userId }) => {
  return await toggleLikeComment({ commentId, userId });
};

