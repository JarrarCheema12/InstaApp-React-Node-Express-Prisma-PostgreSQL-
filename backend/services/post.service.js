import { createPost,editPost,deletePost,fetchPosts,fetchMyPosts} from "../models/postModel.js"


export const createPostService = async (text, userId,imageUrl = null) => {
   try {
          const res = await createPost(text,userId,imageUrl)
          return res
      } catch (error) {
          throw error   
      }
};

export const fetchPostsService = async (userId) => {
  try {
        
        
          const res = await fetchPosts(userId)
          return res
      } catch (error) {
          throw error 
      }
};

export const fetchMyPostsService = async (userId) => {
  try {
          const res = await fetchMyPosts(userId)
          return res
      } catch (error) {
          throw error 
      }
};

export const editPostService = async (postId, newText) => {
 try {
          const res = await editPost(postId,newText)
          return res
      } catch (error) {
          throw error 
      }
};

export const deletePostService = async (postId) => {
  try {
          const res = await deletePost(postId)
          return res
      } catch (error) {
          throw error 
      }
};