import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
} from "lucide-react";
import Message from "./Message";
import "../styles/ChatWindow.css";
const ChatWindow = ({
  selectedChat,
  messages,
  onSendMessage,
  user,
  onBack,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-window-header">
        <div className="chat-header-content">
          <div className="chat-header-info">
            {onBack && (
              <button className="back-button" onClick={onBack}>
                <ArrowLeft size={22} />
              </button>
            )}
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
