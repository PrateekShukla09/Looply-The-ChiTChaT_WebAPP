// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Paperclip, Smile, MoreVertical, Phone, Video, ArrowDown } from 'lucide-react';
// import Message from './Message';
// import '../styles/ChatWindow.css';

// const ChatWindow = ({ selectedChat, messages, onSendMessage, user, socket, messagesEndRef, onlineUsers }) => {
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingUsers, setTypingUsers] = useState(new Set());
//   const [showScrollButton, setShowScrollButton] = useState(false);
//   const messagesContainerRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   // Handle typing indicators
//   useEffect(() => {
//     if (socket && selectedChat) {
//       socket.on('user-typing', (data) => {
//         if (data.chatId === selectedChat._id && data.userId !== user._id) {
//           setTypingUsers(prev => new Set([...prev, data.userId]));
//         }
//       });

//       socket.on('user-stop-typing', (data) => {
//         if (data.chatId === selectedChat._id) {
//           setTypingUsers(prev => {
//             const newSet = new Set(prev);
//             newSet.delete(data.userId);
//             return newSet;
//           });
//         }
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.off('user-typing');
//         socket.off('user-stop-typing');
//       }
//     };
//   }, [socket, selectedChat, user]);

//   // Handle scroll events
//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       const { scrollTop, scrollHeight, clientHeight } = container;
//       const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
//       setShowScrollButton(!isNearBottom);
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (newMessage.trim() && selectedChat) {
//       onSendMessage({
//         content: newMessage.trim(),
//         messageType: 'text'
//       });
//       setNewMessage('');
      
//       // Stop typing
//       if (socket && isTyping) {
//         socket.emit('typing-stop', { chatId: selectedChat._id });
//         setIsTyping(false);
//       }
//     }
//   };

//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value);
    
//     if (socket && selectedChat) {
//       if (!isTyping && e.target.value.trim()) {
//         socket.emit('typing-start', { chatId: selectedChat._id });
//         setIsTyping(true);
//       }
      
//       // Clear existing timeout
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }
      
//       // Set new timeout
//       typingTimeoutRef.current = setTimeout(() => {
//         if (isTyping) {
//           socket.emit('typing-stop', { chatId: selectedChat._id });
//           setIsTyping(false);
//         }
//       }, 1000);
//     }
//   };

//   const getChatName = (chat) => {
//     if (!chat) return '';
//     if (chat.isGroupChat) {
//       return chat.name || 'Group Chat';
//     } else {
//       const otherParticipant = chat.participants.find(p => p._id !== user._id);
//       return otherParticipant?.name || 'Unknown User';
//     }
//   };

//   const isOnline = (chat) => {
//     if (!chat || chat.isGroupChat) return false;
//     const otherParticipant = chat.participants.find(p => p._id !== user._id);
//     return onlineUsers.has(otherParticipant?._id) || otherParticipant?.isOnline || false;
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   if (!selectedChat) {
//     return (
//       <div className="empty-chat-state">
//         <div className="empty-chat-content">
//           <div className="empty-chat-icon">
//             <div className="floating-icons">
//               <Send size={40} className="icon-1" />
//               <Smile size={24} className="icon-2" />
//               <Paperclip size={20} className="icon-3" />
//             </div>
//           </div>
//           <h3>Welcome to Your Chat App!</h3>
//           <p>Select a conversation from the sidebar to start chatting, or use an invite key to add new contacts and begin your messaging journey.</p>
//           <div className="feature-highlights">
//             <div className="feature-item">
//               <div className="feature-icon">📱</div>
//               <span>Real-time messaging</span>
//             </div>
//             <div className="feature-item">
//               <div className="feature-icon">🔗</div>
//               <span>Easy invite system</span>
//             </div>
//             <div className="feature-item">
//               <div className="feature-icon">🔒</div>
//               <span>Secure & private</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-window">
//       {/* Enhanced Chat Header */}
//       <div className="chat-window-header">
//         <div className="chat-header-content">
//           <div className="chat-header-info">
//             <div className="chat-header-avatar">
//               <img
//                 src={`https://ui-avatars.com/api/?name=${getChatName(selectedChat)}&background=random&size=44`}
//                 alt={getChatName(selectedChat)}
//               />
//               {isOnline(selectedChat) && (
//                 <div className="chat-online-indicator pulse"></div>
//               )}
//             </div>
//             <div className="chat-header-details">
//               <h3>{getChatName(selectedChat)}</h3>
//               <p className="status-text">
//                 {isOnline(selectedChat) ? (
//                   <span className="online-status">
//                     <span className="status-dot"></span>
//                     Online now
//                   </span>
//                 ) : (
//                   'Last seen recently'
//                 )}
//               </p>
//             </div>
//           </div>

//           <div className="chat-header-actions">
//             <button className="header-action-button" title="Voice call">
//               <Phone size={20} />
//             </button>
//             <button className="header-action-button" title="Video call">
//               <Video size={20} />
//             </button>
//             <button className="header-action-button" title="More options">
//               <MoreVertical size={20} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Messages Area */}
//       <div className="messages-area" ref={messagesContainerRef}>
//         <div className="messages-content">
//           {messages.length === 0 ? (
//             <div className="empty-messages-state">
//               <div className="conversation-starter">
//                 <div className="starter-icon">👋</div>
//                 <h4>Start the conversation!</h4>
//                 <p>Send the first message to {getChatName(selectedChat)}</p>
//               </div>
//             </div>
//           ) : (
//             <>
//               {messages.map((message, index) => (
//                 <Message
//                   key={message._id}
//                   message={message}
//                   isOwn={message.sender._id === user._id}
//                   user={user}
//                   showAvatar={
//                     index === 0 || 
//                     messages[index - 1]?.sender._id !== message.sender._id
//                   }
//                 />
//               ))}
              
//               {/* Typing Indicator */}
//               {typingUsers.size > 0 && (
//                 <div className="typing-indicator">
//                   <div className="typing-avatar">
//                     <div className="typing-dots">
//                       <span></span>
//                       <span></span>
//                       <span></span>
//                     </div>
//                   </div>
//                   <span className="typing-text">
//                     {Array.from(typingUsers).length === 1 ? 'Someone is' : 'People are'} typing...
//                   </span>
//                 </div>
//               )}
              
//               <div ref={messagesEndRef} />
//             </>
//           )}
//         </div>

//         {/* Scroll to bottom button */}
//         {showScrollButton && (
//           <button className="scroll-to-bottom" onClick={scrollToBottom}>
//             <ArrowDown size={20} />
//             <span className="scroll-badge">New messages</span>
//           </button>
//         )}
//       </div>

//       {/* Enhanced Message Input */}
//       <div className="message-input-area">
//         <form onSubmit={handleSubmit} className="message-input-container">
//           <button type="button" className="attachment-button" title="Attach file">
//             <Paperclip size={20} />
//           </button>

//           <div className="input-wrapper">
//             <textarea
//               value={newMessage}
//               onChange={handleInputChange}
//               placeholder={`Message ${getChatName(selectedChat)}...`}
//               className="message-input"
//               maxLength={1000}
//               rows={1}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSubmit(e);
//                 }
//               }}
//             />
//             <button type="button" className="emoji-button" title="Add emoji">
//               <Smile size={18} />
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={!newMessage.trim()}
//             className={`send-button ${newMessage.trim() ? 'active' : ''}`}
//             title="Send message"
//           >
//             <Send size={18} />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;








import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import Message from "./Message";
import '../styles/ChatWindow.css';
const ChatWindow = ({ selectedChat, messages, onSendMessage, user }) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedChat) {
      onSendMessage({
        content: newMessage.trim(),
        messageType: "text",
      });
      setNewMessage("");
    }
  };
  const currentUserId = user?._id || user?.id;

  // const getChatName = (chat) => {
  //   if (chat.isGroupChat) {
  //     return chat.name || 'Group Chat';
  //   } else {
  //     const otherParticipant = chat.participants.find(p => p._id !== user._id);
  //     return otherParticipant?.name || 'Unknown User';
  //   }
  // };
  const getChatName = (chat) => {
    if (!chat) return "";
    if (chat.isGroupChat) {
      return chat.name || "Group Chat";
    } else {
      // Find the OTHER participant (not the current user)
      const otherParticipant = chat.participants.find(
        (p) => p._id !== currentUserId
      );
      return otherParticipant?.name || "Unknown User";
    }
  };
  const isOnline = (chat) => {
    if (chat.isGroupChat) return false;
    const otherParticipant = chat.participants.find(
      (p) => p._id !== currentUserId
    );
    return otherParticipant?.isOnline || false;
  };

  // if (!selectedChat) {
  //   return (
  //     <div className="flex-1 flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
  //           <Send size={40} className="text-gray-400" />
  //         </div>
  //         <h3 className="text-xl font-semibold text-gray-700 mb-2">
  //           Welcome to Looply!
  //         </h3>
  //         <p className="text-gray-500 max-w-md">
  //           Select a conversation from the sidebar to start chatting, or use an
  //           invite key to add new contacts.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }
  if (!selectedChat) {
    return (
      <div className="empty-chat-state">
        <div className="empty-chat-content">
          <div className="empty-chat-icon">
            <Send size={60} />
          </div>
          <h3>Welcome to Looply!</h3>
          <p>
            Select a conversation from the sidebar to start chatting, or use an
            invite key to add new contacts.
          </p>
        </div>
      </div>
    );
  }

  return (
    // <div className="flex-1 flex flex-col bg-white">
    //   {/* Chat Header */}
    //   <div className="bg-white border-b border-gray-200 px-6 py-4">
    //     <div className="flex items-center justify-between">
    //       <div className="flex items-center space-x-3">
    //         <div className="relative">
    //           <img
    //             src={`https://ui-avatars.com/api/?name=${getChatName(
    //               selectedChat
    //             )}&background=random`}
    //             alt={getChatName(selectedChat)}
    //             className="w-10 h-10 rounded-full"
    //           />
    //           {isOnline(selectedChat) && (
    //             <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
    //           )}
    //         </div>
    //         <div>
    //           <h3 className="font-semibold text-gray-900">
    //             {getChatName(selectedChat)}
    //           </h3>
    //           <p className="text-sm text-gray-500">
    //             {isOnline(selectedChat) ? "Online" : "Last seen recently"}
    //           </p>
    //         </div>
    //       </div>

    //       <div className="flex items-center space-x-2">
    //         <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
    //           <Phone size={20} className="text-gray-600" />
    //         </button>
    //         <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
    //           <Video size={20} className="text-gray-600" />
    //         </button>
    //         <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
    //           <MoreVertical size={20} className="text-gray-600" />
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Messages Area */}
    //   <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
    //     <div className="space-y-4">
    //       {messages.length === 0 ? (
    //         <div className="text-center py-8">
    //           <p className="text-gray-500">
    //             No messages yet. Start the conversation!
    //           </p>
    //         </div>
    //       ) : (
    //         messages.map((message) => (
    //           <Message
    //             key={message._id}
    //             message={message}
    //             isOwn={message.sender._id === user._id}
    //             user={user}
    //           />
    //         ))
    //       )}
    //       {isTyping && (
    //         <div className="flex items-center space-x-2 text-gray-500">
    //           <div className="flex space-x-1">
    //             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    //             <div
    //               className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
    //               style={{ animationDelay: "0.1s" }}
    //             ></div>
    //             <div
    //               className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
    //               style={{ animationDelay: "0.2s" }}
    //             ></div>
    //           </div>
    //           <span className="text-sm">Someone is typing...</span>
    //         </div>
    //       )}
    //       <div ref={messagesEndRef} />
    //     </div>
    //   </div>

    //   {/* Message Input */}
    //   <div className="bg-white border-t border-gray-200 p-4">
    //     <form
    //       onSubmit={handleSendMessage}
    //       className="flex items-center space-x-3"
    //     >
    //       <button
    //         type="button"
    //         className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
    //       >
    //         <Paperclip size={20} />
    //       </button>

    //       <div className="flex-1 relative">
    //         <input
    //           type="text"
    //           value={newMessage}
    //           onChange={(e) => setNewMessage(e.target.value)}
    //           placeholder="Type a message..."
    //           className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    //           maxLength={1000}
    //         />
    //         <button
    //           type="button"
    //           className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
    //         >
    //           <Smile size={18} />
    //         </button>
    //       </div>

    //       <button
    //         type="submit"
    //         disabled={!newMessage.trim()}
    //         className={`p-3 rounded-full transition-all ${
    //           newMessage.trim()
    //             ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
    //             : "bg-gray-200 text-gray-400 cursor-not-allowed"
    //         }`}
    //       >
    //         <Send size={18} />
    //       </button>
    //     </form>
    //   </div>
    // </div>
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-window-header">
        <div className="chat-header-content">
          <div className="chat-header-info">
            <div className="chat-header-avatar">
              <img
                src={`https://ui-avatars.com/api/?name=${getChatName(
                  selectedChat
                )}&background=random`}
                alt={getChatName(selectedChat)}
              />
              {isOnline(selectedChat) && (
                <div className="chat-online-indicator"></div>
              )}
            </div>
            <div className="chat-header-details">
              <h3>{getChatName(selectedChat)}</h3>
              <p>{isOnline(selectedChat) ? "Online" : "Last seen recently"}</p>
            </div>
          </div>

          <div className="chat-header-actions">
            <button className="header-action-button">
              <Phone size={20} />
            </button>
            <button className="header-action-button">
              <Video size={20} />
            </button>
            <button className="header-action-button">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          // messages.map((message) => (
          //   <Message
          //     key={message._id}
          //     message={message}
          //     isOwn={message.sender._id === user._id}
          //     user={user}
          //   />
          messages
            .filter((msg) => msg && msg._id) // skip null or invalid
            .map((message) => (
              <Message
                key={message._id}
                message={message}
                isOwn={message?.sender?._id === user?._id}
                user={user}
              />
            ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-area">
        <form onSubmit={handleSendMessage} className="message-input-container">
          <button type="button" className="attachment-button">
            <Paperclip size={20} />
          </button>

          <div className="input-wrapper">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
              maxLength={1000}
              rows={1}
            />
            <button type="button" className="emoji-button">
              <Smile size={18} />
            </button>
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="send-button"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Send,
//   Paperclip,
//   Smile,
//   MoreVertical,
//   Phone,
//   Video,
// } from "lucide-react";
// import Message from "./Message";
// import "../styles/ChatApp.css";
// const ChatWindow = ({ selectedChat, messages, onSendMessage, user }) => {
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (newMessage.trim() && selectedChat) {
//       onSendMessage({
//         content: newMessage.trim(),
//         messageType: "text",
//       });
//       setNewMessage("");
//     }
//   };

//   const currentUserId = user?._id || user?.id;

//   const getChatName = (chat) => {
//     if (!chat) return "";
//     if (chat.isGroupChat) {
//       return chat.name || "Group Chat";
//     } else {
//       const otherParticipant = chat.participants.find(
//         (p) => p._id !== currentUserId
//       );
//       return otherParticipant?.name || "Unknown User";
//     }
//   };

//   const isOnline = (chat) => {
//     if (chat.isGroupChat) return false;
//     const otherParticipant = chat.participants.find(
//       (p) => p._id !== currentUserId
//     );
//     return otherParticipant?.isOnline || false;
//   };

//   if (!selectedChat) {
//     return (
//       <div className="chat-window empty-chat">
//         <div className="welcome-message">
//           <div className="welcome-icon">
//             <Send size={40} />
//           </div>
//           <h3>Welcome to Looply!</h3>
//           <p>
//             Select a conversation from the sidebar to start chatting, or use an
//             invite key to add new contacts.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-window">
//       {/* Chat Header */}
//       <div className="chat-header">
//         <div className="chat-header-left">
//           <div className="avatar-container">
//             <img
//               src={`https://ui-avatars.com/api/?name=${getChatName(
//                 selectedChat
//               )}&background=random`}
//               alt={getChatName(selectedChat)}
//               className="avatar"
//             />
//             {isOnline(selectedChat) && <span className="online-indicator"></span>}
//           </div>
//           <div>
//             <h3>{getChatName(selectedChat)}</h3>
//             <p>{isOnline(selectedChat) ? "Online" : "Last seen recently"}</p>
//           </div>
//         </div>

//         <div className="chat-header-actions">
//           <button>
//             <Phone size={20} />
//           </button>
//           <button>
//             <Video size={20} />
//           </button>
//           <button>
//             <MoreVertical size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="messages-container">
//         {messages.length === 0 ? (
//           <div className="no-messages">No messages yet. Start the conversation!</div>
//         ) : (
//           messages.map((message) => (
//             <Message
//               key={message._id}
//               message={message}
//               isOwn={message.sender._id === user._id}
//               user={user}
//             />
//           ))
//         )}
//         {isTyping && (
//           <div className="typing-indicator">
//             <span></span>
//             <span></span>
//             <span></span>
//             <span className="typing-text">Someone is typing...</span>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <div className="message-input-container">
//         <form onSubmit={handleSendMessage} className="message-form">
//           <button type="button" className="icon-button">
//             <Paperclip size={20} />
//           </button>

//           <div className="input-wrapper">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//               maxLength={1000}
//             />
//             <button type="button" className="emoji-button">
//               <Smile size={18} />
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={!newMessage.trim()}
//             className={`send-button ${newMessage.trim() ? "active" : ""}`}
//           >
//             <Send size={18} />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;
