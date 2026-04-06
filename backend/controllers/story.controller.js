import { createStoryService, fetchStoriesService, deleteStoryService, fetchMyStoriesService, fetchSingleStoryService } from "../services/story.service.js";
import cloudinary from "../config/cloudinary.js";
export const createStoryController = async (req, res) => {
  try {

    const userId = req.user;
    const { text } = req.body;

    let imageUrl = null;

    if (req.file) {

      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "stories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const result = await createStoryService({
      userId: Number(userId),
      text,
      imageUrl
    });

    res.status(200).json({ success: true, story: result })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


export const fetchStoriesController = async (req, res) => {
  try {

    const stories = await fetchStoriesService()

    res.status(200).json({ success: true, stories })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


export const fetchMyStoriesController = async (req, res) => {
  try {

    const userId = req.user;

    const stories = await fetchMyStoriesService(Number(userId))

    res.status(200).json({ success: true, stories })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


export const fetchSingleStoryController = async (req, res) => {
  try {

    const userId = req.user;
    const { storyId } = req.params;

    const story = await fetchSingleStoryService({
      storyId: Number(storyId),
      userId: Number(userId)
    })

    res.status(200).json({ success: true, story })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


export const deleteStoryController = async (req, res) => {
  try {

    const { storyId } = req.params;

    await deleteStoryService(Number(storyId))

    res.status(200).json({ success: true })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}