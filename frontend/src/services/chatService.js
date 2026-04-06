import { sendMessage, fetchUserMessages, deleteMessage, markMessagesAsRead } from "../Postgres/PostgresFunctions";


const API = "http://localhost:5000/api/v1/chats";

export const sendUserMessage = async (friendId, text) => {
  try {
    return await sendMessage(friendId, text, API)
  } catch (error) {
    console.log(error);

  }
};

export const fetchMessages = async (friendId) => {
  try {
    return await fetchUserMessages(friendId, API)
  } catch (error) {
    console.log(error);

  }
};

export const deleteUserMessage = async (messageId) => {
  try {
    return await deleteMessage(messageId, API)
  } catch (error) {
    console.log(error);
  }
}

export const markUserMessagesAsRead = async (friendId) => {
  try {
    return await markMessagesAsRead(friendId, API)
  } catch (error) {
    console.log(error);
  }
}
