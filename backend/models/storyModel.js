import prisma from "../config/prisma.js";

export const createStory = async ({ userId, text, imageUrl }) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const story = await prisma.stories.create({
    data: {
      user_id: userId,
      text,
      expires_at: expiresAt,
      image_url: imageUrl,
    },
  });

  return story;
};

export const fetchStories = async () => {
  const stories = await prisma.stories.findMany({
    where: { expires_at: { gt: new Date() } },
    include: { users: { select: { username: true } } },
    orderBy: [{ expires_at: "asc" }, { created_at: "desc" }],
  });

  return stories.map((s) => ({
    ...s,
    username: s.users?.username,
  }));
};

export const fetchMyStories = async (userId) => {
  const stories = await prisma.stories.findMany({
    where: {
      user_id: userId,
      expires_at: { gt: new Date() },
    },
    orderBy: [{ expires_at: "asc" }, { created_at: "desc" }],
  });

  return stories;
};

export const fetchSingleStory = async ({ storyId, userId }) => {
  const sid = Number(storyId);
  const uid = Number(userId);

  const story = await prisma.stories.findUnique({
    where: { id: sid },
    include: {
      users: { select: { username: true } },
      story_views: { select: { user_id: true } },
    },
  });

  if (!story) throw new Error("Story not found");

  if (story.user_id !== uid) {
    await prisma.story_views.upsert({
      where: { user_id_story_id: { user_id: uid, story_id: sid } },
      update: {},
      create: { user_id: uid, story_id: sid },
    });
  }

  return {
    ...story,
    username: story.users?.username,
    viewers_count: story.story_views.length,
  };
};

export const deleteStory = async (storyId) => {
  const id = Number(storyId);
  await prisma.stories.delete({ where: { id } });
  return true;
};