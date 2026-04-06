import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendUserMessage as sendUserMessageService, fetchMessages as fetchMessagesService, deleteUserMessage as deleteUserMessageService, markUserMessagesAsRead as markMessagesAsReadService } from "../services/chatService";

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async ({ friendId, text }, thunkAPI) => {
    try {
      const message = await sendUserMessageService(friendId, text);
      return { friendId, message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchMessagesThunk = createAsyncThunk(
  "chat/fetchMessages",
  async (friendId, thunkAPI) => {
    try {
      const messages = await fetchMessagesService(friendId);
      return { friendId, messages };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteMessageThunk = createAsyncThunk(
  "chat/deleteMessage",
  async ({ friendId, messageId }, thunkAPI) => {
    try {
      await deleteUserMessageService(messageId);
      return { friendId, messageId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: {},
    loading: true,
  },
  reducers: {
    setMessages: (state, action) => {
      const { friendId, messages } = action.payload;
      state.conversations[friendId] = messages;
      state.loading = false;
    },
    addMessage: (state, action) => {
      const { friendId, message } = action.payload;
      const key = friendId.toString();
      if (!state.conversations[key]) state.conversations[key] = [];
      state.conversations[key].push(message);
    },
    removeMessage: (state, action) => {
      const { friendId, messageId } = action.payload;
      const key = friendId.toString();
      if (!state.conversations[key]) return;
      state.conversations[key] = state.conversations[key].filter(
        (msg) => msg.id !== messageId
      );
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        const { friendId, message } = action.payload;
        if (!state.conversations[friendId]) state.conversations[friendId] = [];
        state.conversations[friendId].push(message);
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        const { friendId, messages } = action.payload;
        state.conversations[friendId] = messages;
      })
      .addCase(deleteMessageThunk.fulfilled, (state, action) => {
        const { friendId, messageId } = action.payload;
        state.conversations[friendId] = state.conversations[friendId].filter(
          (msg) => msg.id !== messageId
        );
      });
  },

});

export const { setMessages, addMessage, removeMessage } = chatSlice.actions;
export default chatSlice.reducer;
