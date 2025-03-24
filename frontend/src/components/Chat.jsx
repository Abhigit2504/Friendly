import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchChatMessages = useCallback(async () => {
    try {
      setLoading(true);
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          photourl: senderId?.photourl,
          text,
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    socket.current = createSocketConnection();
    if (socket.current) {
      socket.current.emit("joinChat", {
        firstName: user.firstName,
        photourl: user.photourl,
        userId,
        targetUserId,
      });

      socket.current.on(
        "messageReceived",
        ({ firstName, lastName, text, photourl }) => {
          setMessages((messages) => [
            ...messages,
            { firstName, lastName, text, photourl },
          ]);
        }
      );
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId, targetUserId, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !socket.current) return;
    socket.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      photourl: user.photourl,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  const clearMessages = async () => {
    try {
      await axios.delete(BASE_URL + `/chat/${targetUserId}`, {
        withCredentials: true,
      });
      setMessages([]);
    } catch (error) {
      console.error("Error clearing messages:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 h-[80vh] flex flex-col rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
        <h1 className="text-xl font-bold">Direct Message</h1>
        <p className="text-sm opacity-80">
          {messages.length > 0 ? "Active now" : "Start a conversation"}
        </p>
      </div>

      {/* Messages area */}
      <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-gray-300 mb-2"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Say hello to start chatting!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                user.firstName === msg.firstName ? "justify-end" : "justify-start"
              }`}
            >
              {user.firstName !== msg.firstName && (
                <div className="mr-3 flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full object-cover shadow"
                    src={
                      msg.photourl ||
                      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    }
                    alt="Profile"
                  />
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  user.firstName === msg.firstName
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                } shadow`}
              >
                {user.firstName !== msg.firstName && (
                  <p className="font-semibold text-sm">
                    {msg.firstName} {msg.lastName}
                  </p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 text-right mt-1">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {user.firstName === msg.firstName && (
                <div className="ml-3 flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full object-cover shadow"
                    src={
                      user.photourl ||
                      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    }
                    alt="Profile"
                  />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        className="bg-white border-t border-gray-200 p-4 flex items-center"
        onSubmit={sendMessage}
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Type a message..."
          autoFocus
        />
        <button
          type="submit"
          className="ml-3 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={clearMessages}
          className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
          title="Clear chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;