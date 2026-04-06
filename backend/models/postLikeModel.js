import prisma from "../config/prisma.js";

export const toggleLikePost = async (postId, userId) => {
  try {
    const existingLike = await prisma.post_likes.findUnique({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: postId,
        },
      },
      select: { user_id: true },
    });

    if (existingLike) {
      await prisma.post_likes.delete({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });
      return { uid: postId, is_liked: false };
    }

    await prisma.post_likes.create({
      data: {
        user_id: userId,
        post_id: postId,
      },
    });

    return { uid: postId, is_liked: true };
  } catch (error) {
    throw error;
  }
};

