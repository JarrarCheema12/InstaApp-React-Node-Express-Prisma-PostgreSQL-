import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { socket } from "../../socket.js"
import { addMessage, removeMessage } from "../../store/chatSlice";

import {
  sendMessageThunk,
  fetchMessagesThunk,
  deleteMessageThunk,
} from "../../store/chatSlice";
import { markUserMessagesAsRead } from "../../services/chatService";

const Chat = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const friend = useSelector((state) =>
    state.friends.friends.find((f) => f.id === Number(id))
  );

  const [message, setMessage] = useState("");

  const messages = useSelector(
    (state) => state.chat.conversations[id] || []
  );

  useEffect(() => {
    if (!authUser || !id) return;

    socket.emit("join", authUser.uid.toString())

    dispatch(fetchMessagesThunk(id));
    markUserMessagesAsRead(id);

  }, [id, authUser, dispatch]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (!data || !data.message) return;

      const msg = data.message;

      const conversationKey =
        msg.sender_id === authUser.uid
          ? id.toString()
          : msg.sender_id.toString();

      dispatch(addMessage({ friendId: conversationKey, message: msg }));
    });
    socket.on("delete_message", (data) => {
      const friendIdKey =
        data.sender_id === authUser.uid ? data.receiver_id.toString() : data.sender_id.toString();

      dispatch(removeMessage({ friendId: friendIdKey, messageId: data.messageId }));
    });

    return () => {
      socket.off("receive_message");
      socket.off("delete_message");
    };


  }, [dispatch, authUser.uid, id]);


  if (!friend || !authUser) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
        Loading chat...
      </div>
    );
  }



  const handleSend = async () => {
    if (!message.trim()) return;

    const res = await dispatch(
      sendMessageThunk({ friendId: Number(id), text: message })
    );

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Message sent");
      setMessage("");
    }
  };

  const handleDelete = async (msgId) => {
    const res = await dispatch(
      deleteMessageThunk({ friendId: id, messageId: msgId })
    );

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Message deleted");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 md:px-6 py-6 md:py-10">
      <div className="w-full max-w-2xl h-[85vh] flex flex-col border border-white/[0.07] rounded-xl overflow-hidden bg-[#111111]">

        <div className="flex items-center justify-between px-5 md:px-6 py-3 md:py-4 border-b border-white/6 bg-[#111111] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-base font-semibold uppercase">
              {friend?.username?.[0]}
            </div>
            <span className="text-white/80 text-base md:text-lg font-medium">{friend?.username}</span>
          </div>
          <Link
            to="/myFriends"
            className="text-sm md:text-base text-white/30 hover:text-white/70 hover:bg-white/6 transition-all duration-200 px-3 py-1.5 rounded-lg font-medium"
          >
            ← Friends
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-4 md:px-5 py-4">
          {messages.map((msg) => {
            const isMe = msg.sender_id === authUser.uid
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-white/[0.07] flex items-center justify-center text-white/40 text-xs font-semibold uppercase shrink-0 mb-0.5">
                    {friend?.username?.[0]}
                  </div>
                )}

                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-base md:text-lg leading-snug ${isMe
                      ? "bg-white/10 text-white/90 rounded-br-sm"
                      : "bg-white/6 text-white/75 rounded-bl-sm"
                    }`}
                >
                  {msg.text}
                </div>

                {isMe && (
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-white/15 hover:text-red-400 transition-colors text-sm shrink-0 mb-0.5 px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2 px-4 md:px-5 py-3 md:py-4 border-t border-white/6 bg-[#111111] shrink-0">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-white/80 text-base md:text-lg placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
          />
          <button
            onClick={handleSend}
            className="text-sm md:text-base text-white/80 hover:text-white bg-white/10 hover:bg-white/15 transition-all duration-200 px-5 py-2.5 rounded-xl font-medium shrink-0"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  )
}
export default Chat;