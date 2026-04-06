import { createPostService, fetchPostsService, editPostService, deletePostService, fetchMyPostsService } from "../services/post.service.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user;

    let imageUrl = null;

    if (req.file) {

      const result = await cloudinary.uploader.upload_stream(
        { folder: "posts" },
        (error, result) => {
          if (error) throw error;
          return result;
        }
      );

      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const post = await createPostService(text, userId, imageUrl);
    res.status(201).json({ post, message: "Post created successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchPosts = async (req, res) => {
  try {
    const userId = req.user;

    const posts = await fetchPostsService(userId);
    res.status(200).json({ posts, message: "Posts fetched successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchMyPosts = async (req, res) => {
  try {
    const userId = req.user;
    const posts = await fetchMyPostsService(userId);
    res.status(200).json({ posts, message: "My posts fetched successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const { postId, newText } = req.body;
    if (!newText) return res.status(400).json({ message: "Text is required", success: false });

    await editPostService(postId, newText);
    res.status(200).json({ message: "Post updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    await deletePostService(postId);
    res.status(200).json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};