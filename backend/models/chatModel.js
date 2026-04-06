import prisma from "../config/prisma.js";

export const getOrCreateChat = async (userId1, userId2) => {
  const [user1, user2] = [userId1, userId2].sort((a, b) => a - b);

  const existingChat = await prisma.chats.findFirst({
    where: {
      AND: [
        { chat_users: { some: { user_id: user1 } } },
        { chat_users: { some: { user_id: user2 } } },
      ],
    },
  });

  if (existingChat) return existingChat;

  const createdChat = await prisma.$transaction(async (tx) => {
    const chat = await tx.chats.create({ data: {} });

    await tx.chat_users.createMany({
      data: [
        { chat_id: chat.id, user_id: user1 },
        { chat_id: chat.id, user_id: user2 },
      ],
      skipDuplicates: true,
    });

    return chat;
  });

  return createdChat;
};

export const sendMessage = async ({ senderId, friendId, text }) => {
  const chat = await getOrCreateChat(senderId, friendId);

  const message = await prisma.messages.create({
    data: {
      chat_id: chat.id,
      sender_id: senderId,
      text,
    },
  });

  return message;
};

export const fetchMessages = async (userId1, userId2) => {
  const [user1, user2] = [userId1, userId2].sort((a, b) => a - b);

  const chat = await prisma.chats.findFirst({
    where: {
      AND: [
        { chat_users: { some: { user_id: user1 } } },
        { chat_users: { some: { user_id: user2 } } },
      ],
    },
    select: { id: true },
  });

  if (!chat) return [];

  const messages = await prisma.messages.findMany({
    where: { chat_id: chat.id },
    orderBy: { created_at: "asc" },
  });

  return messages;
};

export const deleteMessage = async (messageId) => {
  const id = Number(messageId);
  await prisma.messages.delete({ where: { id } });
  return true;
};

export const markMessagesAsRead = async (myId, friendId) => {
  const [user1, user2] = [myId, friendId].sort((a, b) => a - b);

  const chat = await prisma.chats.findFirst({
    where: {
      AND: [
        { chat_users: { some: { user_id: user1 } } },
        { chat_users: { some: { user_id: user2 } } },
      ],
    },
    select: { id: true },
  });

  if (!chat) return;

  await prisma.messages.updateMany({
    where: {
      chat_id: chat.id,
      NOT: { sender_id: myId },
    },
    data: { read: true },
  });
};

export const checkUnreadMessages = async (myId, friendId) => {
  const [user1, user2] = [myId, friendId].sort((a, b) => a - b);

  const chat = await prisma.chats.findFirst({
    where: {
      AND: [
        { chat_users: { some: { user_id: user1 } } },
        { chat_users: { some: { user_id: user2 } } },
      ],
    },
    select: { id: true },
  });

  if (!chat) return false;

  const unread = await prisma.messages.findFirst({
    where: {
      chat_id: chat.id,
      read: false,
      NOT: { sender_id: myId },
    },
    select: { id: true },
  });

  return Boolean(unread);
};

export const fetchMessageWithReceiver = async (messageId) => {
  const id = Number(messageId);

  const message = await prisma.messages.findUnique({
    where: { id },
    include: {
      chats: {
        include: {
          chat_users: { select: { user_id: true } },
        },
      },
    },
  });

  if (!message) return null;

  const receiver = message.chats?.chat_users?.find(
    (cu) => cu.user_id !== message.sender_id
  );

  return {
    ...message,
    receiver_id: receiver?.user_id,
  };
};