import { createStory, fetchStories, deleteStory, fetchMyStories, fetchSingleStory } from "../Postgres/PostgresFunctions";

const API = "http://localhost:5000/api/v1/stories"

export const createUserStory = async (formData) => {
  return await createStory(formData, API);
};

export const fetchUserStories = async () => {
  return await fetchStories(API);
};

export const deleteUserStory = async (storyId) => {
  return await deleteStory(storyId, API);
};

export const fetchSingleUserStories = async () => {
  return await fetchMyStories(API);
};

export const fetchUserSingleStory = async (storyId) => {
  return await fetchSingleStory(storyId, API);
};