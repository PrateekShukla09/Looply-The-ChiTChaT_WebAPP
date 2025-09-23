// src/components/ChatApp.jsx
import React, { useState, useEffect,useRef } from "react";
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
      transports: ['websocket', 'polling']
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
    <div className="chat-app-container">
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
      />
    </div>
  );
};

export default ChatApp;

// import React, { useState, useEffect, useRef } from 'react';
// import Sidebar from './Sidebar';
// import ChatWindow from './ChatWindow';
// import { useAuth } from '../hooks/useAuth';
// import { chatAPI } from '../utils/api';
// import io from 'socket.io-client';
// import '../styles/ChatApp.css';

// const ChatApp = () => {
//   const { user } = useAuth();
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [onlineUsers, setOnlineUsers] = useState(new Set());
//   const messagesEndRef = useRef(null);

//   // Initialize socket connection
//   useEffect(() => {
//     if (user) {
//       const token = localStorage.getItem('token');
//       const newSocket = io('http://localhost:5001', {
//         auth: { token },
//         transports: ['websocket', 'polling']
//       });

//       newSocket.on('connect', () => {
//         console.log('Connected to server');
//         // Join user's chats
//         const chatIds = chats.map(chat => chat._id);
//         if (chatIds.length > 0) {
//           newSocket.emit('join-chats', chatIds);
//         }
//       });

//       // FIXED: Handle new messages
//       newSocket.on('new-message', (data) => {
//         console.log('New message received:', data);

//         // Add message to current messages if it's for the selected chat
//         if (selectedChat && data.message.chat === selectedChat._id) {
//           setMessages(prevMessages => {
//             // Check if message already exists to avoid duplicates
//             const messageExists = prevMessages.some(msg => msg._id === data.message._id);
//             if (!messageExists) {
//               return [...prevMessages, data.message];
//             }
//             return prevMessages;
//           });
//         }

//         // Update the chat list with new last message
//         setChats(prevChats =>
//           prevChats.map(chat => {
//             if (chat._id === data.message.chat) {
//               return {
//                 ...chat,
//                 lastMessage: data.message,
//                 updatedAt: new Date(data.message.createdAt)
//               };
//             }
//             return chat;
//           })
//         );
//       });

//       // Handle message delivery confirmations
//       newSocket.on('message-delivered', (data) => {
//         console.log('Message delivered:', data);
//         setMessages(prevMessages =>
//           prevMessages.map(msg =>
//             msg._id === data.messageId
//               ? { ...msg, deliveredTo: data.deliveredTo }
//               : msg
//           )
//         );
//       });

//       // Handle read receipts
//       newSocket.on('messages-read', (data) => {
//         console.log('Messages read:', data);
//         setMessages(prevMessages =>
//           prevMessages.map(msg => {
//             if (data.messageIds.includes(msg._id)) {
//               return {
//                 ...msg,
//                 readBy: [...(msg.readBy || []), { user: data.readBy, readAt: data.readAt }]
//               };
//             }
//             return msg;
//           })
//         );
//       });

//       // Handle typing indicators
//       newSocket.on('user-typing', (data) => {
//         // Handle typing indicator logic here
//         console.log('User typing:', data);
//       });

//       newSocket.on('user-stop-typing', (data) => {
//         // Handle stop typing logic here
//         console.log('User stopped typing:', data);
//       });

//       // Handle online/offline status
//       newSocket.on('user-online', (userId) => {
//         setOnlineUsers(prev => new Set([...prev, userId]));
//       });

//       newSocket.on('user-offline', (userId) => {
//         setOnlineUsers(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(userId);
//           return newSet;
//         });
//       });

//       newSocket.on('disconnect', () => {
//         console.log('Disconnected from server');
//       });

//       setSocket(newSocket);

//       return () => {
//         newSocket.close();
//       };
//     }
//   }, [user, selectedChat?._id]); // Include selectedChat._id in dependencies

//   // Load chats on component mount
//   useEffect(() => {
//     if (user) {
//       loadChats();
//     }
//   }, [user]);

//   // Join chats when socket connects and chats are loaded
//   useEffect(() => {
//     if (socket && chats.length > 0) {
//       const chatIds = chats.map(chat => chat._id);
//       socket.emit('join-chats', chatIds);
//     }
//   }, [socket, chats]);

//   // Scroll to bottom when new messages arrive
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const loadChats = async () => {
//     try {
//       const response = await chatAPI.getChats();
//       if (response.data.success) {
//         console.log('Loaded chats:', response.data.chats);
//         setChats(response.data.chats);
//       }
//     } catch (error) {
//       console.error('Error loading chats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChatSelect = async (chat) => {
//     setSelectedChat(chat);
//     setMessages([]); // Clear previous messages

//     try {
//       const response = await chatAPI.getMessages(chat._id);
//       if (response.data.success) {
//         setMessages(response.data.messages);

//         // Mark messages as read
//         await chatAPI.markAsRead(chat._id);

//         // Emit read receipt via socket
//         if (socket) {
//           const messageIds = response.data.messages
//             .filter(msg => msg.sender._id !== user._id)
//             .map(msg => msg._id);

//           if (messageIds.length > 0) {
//             socket.emit('mark-messages-read', { chatId: chat._id, messageIds });
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error loading messages:', error);
//     }
//   };

//   const handleSendMessage = async (messageData) => {
//     if (!socket || !selectedChat) return;

//     try {
//       // Optimistically add message to UI
//       const tempMessage = {
//         _id: Date.now().toString(),
//         sender: { _id: user._id, name: user.name, avatar: user.avatar },
//         chat: selectedChat._id,
//         content: messageData.content,
//         messageType: messageData.messageType || 'text',
//         createdAt: new Date().toISOString(),
//         deliveredTo: [],
//         readBy: [],
//         isTemporary: true
//       };

//       setMessages(prev => [...prev, tempMessage]);

//       // Send via socket
//       socket.emit('send-message', {
//         chatId: selectedChat._id,
//         content: messageData.content,
//         messageType: messageData.messageType || 'text',
//         replyTo: messageData.replyTo || null
//       });

//       // Also send via API as backup
//       await chatAPI.sendMessage({
//         chatId: selectedChat._id,
//         content: messageData.content,
//         messageType: messageData.messageType || 'text'
//       });

//     } catch (error) {
//       console.error('Error sending message:', error);
//       // Remove temporary message on error
//       setMessages(prev => prev.filter(msg => !msg.isTemporary));
//     }
//   };

//   const handleNewChat = (newChat) => {
//     console.log('New chat added:', newChat);
//     setChats(prev => [newChat, ...prev]);
//     setSelectedChat(newChat);
//     setMessages([]);

//     // Join the new chat room
//     if (socket) {
//       socket.emit('join-chats', [newChat._id]);
//     }
//   };

//   return (
//     <div className="chat-app-container">
//       <Sidebar
//         chats={chats}
//         selectedChat={selectedChat}
//         onChatSelect={handleChatSelect}
//         onNewChat={handleNewChat}
//         loading={loading}
//         user={user}
//         onlineUsers={onlineUsers}
//       />
//       <ChatWindow
//         selectedChat={selectedChat}
//         messages={messages}
//         onSendMessage={handleSendMessage}
//         user={user}
//         socket={socket}
//         messagesEndRef={messagesEndRef}
//         onlineUsers={onlineUsers}
//       />
//     </div>
//   );
// };

// export default ChatApp;
