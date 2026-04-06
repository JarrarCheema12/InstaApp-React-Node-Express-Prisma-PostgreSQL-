import { fetchPosts, createPost, deletePost, editPost, fetchMyPosts, toggleLikePost } from "../Postgres/PostgresFunctions";



export const fetchAllPosts = async () => {
  try {
    const raw = await fetchPosts();


    if (!Array.isArray(raw)) return [];
    return raw.map(p => ({
      id: p.id,
      userId: p.user_id,
      text: p.text,
      image_url: p.image_url,
      createdAt: p.created_at,
      username: p.username,
      likes_count: Number(p.likes_count),
      isLiked: p.is_liked
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createUserPost = async (formData) => {
  try {
    const p = await createPost(formData);
    if (!p) return null;
    return {
      id: p.id,
      userId: p.user_id,
      text: p.text,
      createdAt: p.created_at,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteUserPost = async (postId) => {
  try {
    return await deletePost(postId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editUserPost = async (postId, newText) => {
  try {
    return await editPost(postId, newText);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchUserPosts = async () => {
  try {
    const raw = await fetchMyPosts();
    if (!Array.isArray(raw)) return [];
    return raw.map(p => ({
      id: p.id,
      userId: p.user_id,
      text: p.text,
      username: p.username,
      image_url: p.image_url,
      createdAt: p.created_at,
      likes_count: Number(p.likes_count),
      isLiked: p.is_liked
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const toggleUserLikePost = async (postId) => {
  try {
    const res = await toggleLikePost(postId)
    return res
  } catch (error) {
    console.log(error);

  }
}