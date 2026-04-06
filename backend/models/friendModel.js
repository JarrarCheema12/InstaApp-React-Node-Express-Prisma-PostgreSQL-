import prisma from "../config/prisma.js";

export const sendFriendRequest = async (fromUserId, toUserId) => {
  const existing = await prisma.friend_requests.findFirst({
    where: { from_user: fromUserId, to_user: toUserId },
    select: { id: true },
  });

  if (existing) return false;

  await prisma.friend_requests.create({
    data: { from_user: fromUserId, to_user: toUserId },
  });

  return true;
};

export const cancelFriendRequest = async (fromUserId, toUserId) => {
  await prisma.friend_requests.deleteMany({
    where: { from_user: fromUserId, to_user: toUserId },
  });
  return true;
};

export const acceptFriendRequest = async (fromUserId, toUserId) => {
  await prisma.$transaction(async (tx) => {
    await tx.friend_requests.deleteMany({
      where: { from_user: fromUserId, to_user: toUserId },
    });

    await tx.friends.createMany({
      data: [
        { user_id: fromUserId, friend_id: toUserId },
        { user_id: toUserId, friend_id: fromUserId },
      ],
      skipDuplicates: true,
    });
  });

  return true;
};

export const rejectFriendRequest = async (fromUserId, toUserId) => {
  await prisma.friend_requests.deleteMany({
    where: { from_user: fromUserId, to_user: toUserId },
  });
  return true;
};

export const fetchFriends = async (userId) => {
  const friends = await prisma.friends.findMany({
    where: { user_id: userId },
    include: {
      users_friends_friend_idTousers: {
        select: {
          id: true,
          fullname: true,
          username: true,
          email: true,
          created_at: true,
        },
      },
    },
  });

  return friends.map((f) => ({
    id: f.users_friends_friend_idTousers.id,
    fullname: f.users_friends_friend_idTousers.fullname,
    username: f.users_friends_friend_idTousers.username,
    email: f.users_friends_friend_idTousers.email,
    created_at: f.users_friends_friend_idTousers.created_at,
  }));
};

export const fetchUsersToAddFriend = async (currentUserId, currentFriends = []) => {
  const users = await prisma.users.findMany({
    where: {
      id: {
        not: currentUserId,
        ...(currentFriends.length > 0 ? { notIn: currentFriends } : {}),
      },
    },
    select: {
      id: true,
      fullname: true,
      username: true,
      email: true,
      created_at: true,
    },
  });

  const friendRequests = await prisma.friend_requests.findMany({
    where: {
      status: "pending",
      OR: [{ from_user: currentUserId }, { to_user: currentUserId }],
    },
    select: { from_user: true, to_user: true },
  });

  const sentRequests = friendRequests
    .filter((r) => r.from_user === currentUserId)
    .map((r) => r.to_user);
  const receivedRequests = friendRequests
    .filter((r) => r.to_user === currentUserId)
    .map((r) => r.from_user);

  return users
    .filter((u) => !receivedRequests.includes(u.id))
    .map((u) => ({
      ...u,
      requestSent: sentRequests.includes(u.id),
      createdAt: u.created_at,
    }));
};

export const unFriendUser = async (userId, friendId) => {
  await prisma.friends.deleteMany({
    where: {
      OR: [
        { user_id: userId, friend_id: friendId },
        { user_id: friendId, friend_id: userId },
      ],
    },
  });
  return true;
};


export const fetchPendingRequests = async (userId) => {
  try {
    const requests = await prisma.friend_requests.findMany({
      where: { status: "pending", to_user: userId },
      include: {
        users_friend_requests_from_userTousers: { select: { username: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return requests.map((r) => ({
      id: r.id,
      from: r.from_user,
      to: r.to_user,
      username: r.users_friend_requests_from_userTousers?.username,
      createdAt: r.created_at,
    }));
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return [];
  }
};