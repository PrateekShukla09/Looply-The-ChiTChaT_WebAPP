// src/components/ChatApp.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../hooks/useAuth";
import { chatAPI } from "../utils/api";
import io from "socket.io-client";
import "../styles/ChatApp.css";

const ChatApp = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";
  useEffect(() => {
    // Initialize socket connection
    const token = localStorage.getItem("token");
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      // Join user's chats
      const chatIds = chats.map((chat) => chat._id);
      if (chatIds.length > 0) {
        newSocket.emit("join-chats", chatIds);
      }
    });

    // newSocket.on("new-message", (message) => {
    //   setMessages((prev) => [...prev, message]);
    //   // Update chat list with new last message
    //   setChats((prev) =>
    //     prev.map((chat) =>
    //       chat._id === message.chat
    //         ? { ...chat, lastMessage: message, updatedAt: new Date() }
    //         : chat
    //     )
    //   );
    // });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [chats]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new-message", (message) => {
      // Only add if it's for the selected chat
      if (selectedChat && message.chat === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
      }

      // Update chat preview in sidebar
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chat
            ? { ...chat, lastMessage: message, updatedAt: new Date() }
            : chat
        )
      );
    });
    return () => {
      socket.off("new-message");
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const response = await chatAPI.getChats();
      if (response.data.success) {
        console.log("Loaded chats:", response.data.chats); // Debug log
        setChats(response.data.chats);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = async (chat) => {
    setSelectedChat(chat);
    // Load messages for selected chat
    try {
      const response = await chatAPI.getMessages(chat._id);
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async (messageData) => {
    if (socket && selectedChat) {
      socket.emit("send-message", {
        chatId: selectedChat._id,
        ...messageData,
      });
    }
  };

  const handleNewChat = (newChat) => {
    console.log("New chat added:", newChat); // Debug log
    setChats((prev) => [newChat, ...prev]);
    setSelectedChat(newChat);
    setMessages([]);
  };

  return (
    <div
      className={`chat-app-container ${selectedChat ? "chat-selected" : ""}`}
    >
      <Sidebar
        chats={chats}
        selectedChat={selectedChat}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        loading={loading}
        user={user}
        className="sidebar"
      />
      <ChatWindow
        selectedChat={selectedChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        user={user}
        className="chat-window"
        onBack={() => setSelectedChat(null)} // 👈 add back handler for mobile
      />
    </div>
  );
};

export default ChatApp;
