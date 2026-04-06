import prisma from "../config/prisma.js";

export const createComment = async ({ postId, userId, text }) => {
  const comment = await prisma.comments.create({
    data: {
      post_id: postId,
      user_id: userId,
      text,
    },
    select: {
      id: true,
      user_id: true,
      post_id: true,
      text: true,
      created_at: true,
    },
  });

  return comment;
};

export const fetchCommentsByPost = async ({ postId, userId }) => {
  const comments = await prisma.comments.findMany({
    where: { post_id: postId },
    include: {
      users: { select: { username: true } },
      comment_likes: { select: { user_id: true } },
    },
    orderBy: { created_at: "asc" },
  });

  return comments.map((c) => ({
    id: c.id,
    user_id: c.user_id,
    post_id: c.post_id,
    text: c.text,
    created_at: c.created_at,
    username: c.users?.username,
    likes_count: c.comment_likes.length,
    is_liked: c.comment_likes.some((l) => l.user_id === userId),
  }));
};

export const toggleLikeComment = async ({ commentId, userId }) => {
  const existingLike = await prisma.comment_likes.findUnique({
    where: {
      user_id_comment_id: { user_id: userId, comment_id: commentId },
    },
    select: { user_id: true },
  });

  if (existingLike) {
    await prisma.comment_likes.delete({
      where: {
        user_id_comment_id: { user_id: userId, comment_id: commentId },
      },
    });
    return { is_liked: false };
  }

  await prisma.comment_likes.create({
    data: { user_id: userId, comment_id: commentId },
  });

  return { is_liked: true };
};

export const deleteComment = async ({ commentId, requesterUserId }) => {
  const comment = await prisma.comments.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      user_id: true,
      posts: { select: { user_id: true } },
    },
  });

  if (!comment) {
    const err = new Error("Comment not found");
    err.statusCode = 404;
    throw err;
  }

  const canDelete =
    Number(comment.user_id) === Number(requesterUserId) ||
    Number(comment.posts?.user_id) === Number(requesterUserId);

  if (!canDelete) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  await prisma.comments.delete({ where: { id: commentId } });
  return true;
};
