import prisma from "../config/prisma.js";


export const createPost = async (text, userId, imageUrl = null) => {
  try {
    const post = await prisma.posts.create({
      data: {
        user_id: userId,
        text,
        image_url: imageUrl,
      },
      select: {
        id: true,
        user_id: true,
        text: true,
        image_url: true,
        created_at: true,
      },
    });

    return post;
  } catch (error) {
    throw error;
  }
};

export const fetchPosts = async (user_id) => {


  try {
    const posts = await prisma.posts.findMany({
      include: {
        users: { select: { username: true } },
        post_likes: { select: { user_id: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return posts.map((p) => ({
      id: p.id,
      user_id: p.user_id,
      text: p.text,
      image_url: p.image_url,
      created_at: p.created_at,
      username: p.users?.username,
      likes_count: p.post_likes.length,
      is_liked: p.post_likes.some((l) => l.user_id === user_id),
    }));
  } catch (error) {
    throw error;
  }
};

export const fetchMyPosts = async (userId) => {
  try {
    const posts = await prisma.posts.findMany({
      where: { user_id: userId },
      include: {
        users: { select: { username: true } },
        post_likes: { select: { user_id: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return posts.map((p) => ({
      id: p.id,
      user_id: p.user_id,
      text: p.text,
      image_url: p.image_url,
      created_at: p.created_at,
      username: p.users?.username,
      likes_count: p.post_likes.length,
      is_liked: p.post_likes.some((l) => l.user_id === userId),
    }));
  } catch (error) {
    throw error;
  }
};

export const editPost = async (postId, newText) => {
  try {
    await prisma.posts.update({
      where: { id: postId },
      data: { text: newText },
    });
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    await prisma.posts.delete({ where: { id: postId } });
  } catch (error) {
    throw error;
  }
};