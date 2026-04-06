import { addComment, fetchComments, deleteUserComment, toggleUserLikeComment } from "../Postgres/PostgresFunctions";

const API = "http://localhost:5000/api/v1/comments";

export const createComment = async ({ postId, text }) => {
  const res = await addComment({ postId, text }, API)
  const c = res.data.comment;
  return {
    id: c.id,
    postId: c.post_id,
    userId: c.user_id,
    text: c.text,
    createdAt: c.created_at,
  };
};

export const fetchCommentsByPost = async (postId) => {

  const res = await fetchComments(postId, API)

  const raw = res.data.comments || [];
  return raw.map((c) => ({
    id: c.id,
    postId: c.post_id,
    userId: c.user_id,
    username: c.username,
    text: c.text,
    createdAt: c.created_at,
    likes_count: Number(c.likes_count) || 0,
    isLiked: Boolean(c.is_liked),
  }));
};

export const deleteComment = async (commentId) => {
  const res = await deleteUserComment(commentId, API)
  return res.data;
};

export const toggleLikeComment = async (commentId) => {
  const res = await toggleUserLikeComment(commentId, API)
  return res.data;
};

