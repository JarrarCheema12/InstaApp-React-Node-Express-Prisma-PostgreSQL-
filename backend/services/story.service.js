import {createStory,fetchStories,deleteStory,fetchMyStories,fetchSingleStory} from "../models/storyModel.js";

export const createStoryService = async ({userId,text,imageUrl = null})=>{
  return await createStory({userId,text,imageUrl})
}

export const fetchStoriesService = async ()=>{
  return await fetchStories()
}

export const fetchMyStoriesService = async (userId)=>{
  return await fetchMyStories(userId)
}

export const fetchSingleStoryService = async ({storyId,userId})=>{
  return await fetchSingleStory({storyId,userId})
}

export const deleteStoryService = async (storyId)=>{
  return await deleteStory(storyId)
}