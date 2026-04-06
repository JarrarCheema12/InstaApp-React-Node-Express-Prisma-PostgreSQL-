import * as chatService from "../services/chat.service.js";
import { io } from "../index.js";

export const sendMessageController = async (req, res) => {
  try {
    const senderId = req.user;
    const { friendId, text } = req.body;
    const message = await chatService.sendMessageService(senderId, friendId, text);

    io.to(friendId.toString()).emit("receive_message", { message })

    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchMessagesController = async (req, res) => {
  try {
    const userId = req.user;
    const { friendId } = req.params;
    const friendIdNum = Number(friendId);
    const messages = await chatService.fetchMessagesService(userId, friendIdNum);
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessageController = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await chatService.fetchMessageWithReceiverId(messageId);
    if (!message) throw new Error("Message not found");

    const success = await chatService.deleteMessageService(messageId);



    io.to(message.receiver_id.toString()).emit("delete_message", {
      messageId: message.id,
      chatId: message.chat_id,
      sender_id: message.sender_id,
      receiver_id: message.receiver_id
    });

    res.status(200).json({ success });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markMessagesAsReadController = async (req, res) => {
  try {
    const myId = req.user;
    const { friendId } = req.params;
    const friendIdNum = Number(friendId);
    await chatService.markMessagesAsReadService(myId, friendIdNum);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkUnreadMessagesController = async (req, res) => {
  try {
    const myId = req.user;
    const { friendId } = req.params;
    const friendIdNum = Number(friendId);
    const hasUnread = await chatService.checkUnreadMessagesService(myId, friendIdNum);
    res.status(200).json({ success: true, hasUnread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};