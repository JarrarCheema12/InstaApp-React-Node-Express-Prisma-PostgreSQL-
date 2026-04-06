import * as chatQuery from "../models/chatModel.js";

export const sendMessageService = async (senderId, friendId, text) => {
  return await chatQuery.sendMessage({ senderId, friendId, text });
};

export const fetchMessagesService = async (userId1, userId2) => {
  return await chatQuery.fetchMessages(userId1, userId2);
};

export const deleteMessageService = async (messageId) => {
  return await chatQuery.deleteMessage(messageId);
};

export const markMessagesAsReadService = async (myId, friendId) => {
  return await chatQuery.markMessagesAsRead(myId, friendId);
};

export const checkUnreadMessagesService = async (myId, friendId) => {
  return await chatQuery.checkUnreadMessages(myId, friendId);
};

export const fetchMessageWithReceiverId = async (messageId) => {
  return await chatQuery.fetchMessageWithReceiver(messageId)
}