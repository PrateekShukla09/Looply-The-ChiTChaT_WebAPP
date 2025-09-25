import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Search, UserPlus, Key, Settings, MoreVertical } from "lucide-react";
import InviteKeyModal from "./InviteKeyModal";
import AddUserByInvite from "./AddUserByInvite";
import UserProfileModal from "./UserProfileModal";
import { formatDistanceToNow } from "date-fns";

const Sidebar = ({
  chats,
  selectedChat,
  onChatSelect,
  onNewChat,
  loading,
  user,
}) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const tabs = ["All", "Favorite", "Groups"];

  const currentUserId = user?._id || user?.id;

  // ✅ Fixed getChatName
  const getChatName = (chat) => {
    if (!chat) return "Unknown Chat";

    if (chat.isGroupChat) {
      return chat.name || chat.chatName || "Group Chat";
    }

    if (!chat.participants || !Array.isArray(chat.participants)) {
      return "Unknown Chat";
    }

    const otherParticipant = chat.participants.find((participant) => {
      const participantId =
        typeof participant === "object" ? participant._id : participant;
      return participantId !== currentUserId;
    });

    return otherParticipant?.name || "User";
  };

  const getChatAvatar = (chat) => {
    if (chat.isGroupChat) {
      return chat.groupAvatar || getChatName(chat).charAt(0);
    } else {
      const otherParticipant = chat.participants.find(
        (p) => p._id !== currentUserId
      );
      return otherParticipant?.avatar || getChatName(chat).charAt(0);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const searchLower = searchQuery.toLowerCase();
    const chatName = getChatName(chat).toLowerCase();
    return chatName.includes(searchLower);
  });

  const getLastMessagePreview = (chat) => {
    if (!chat.lastMessage) return "No messages yet";

    const message = chat.lastMessage;
    let senderName = "Unknown";

    if (message.sender) {
      if (message.sender._id === currentUserId) {
        senderName = "You";
      } else {
        senderName = message.sender.name || "User";
      }
    }

    if (message.messageType === "text") {
      return `${senderName}: ${message.content}`;
    } else {
      return `${senderName}: 📎 ${message.messageType}`;
    }
  };

  const formatMessageTime = (date) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: false });
  };

  const isOnline = (chat) => {
    if (chat.isGroupChat || !chat.participants) return false;

    const otherParticipant = chat.participants.find((participant) => {
      const participantId =
        typeof participant === "object" ? participant._id : participant;
      return participantId !== currentUserId;
    });

    return otherParticipant?.isOnline || false;
  };

  return (
    <>
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar-container">
              <div className="user-avatar">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`
                  }
                  alt={user?.name}
                />
                <div className="online-indicator"></div>
              </div>
              <div className="user-details">
                <h3>{user?.name}</h3>
                <p>Online</p>
              </div>
            </div>

            <div className="header-actions">
              <button
                className="menu-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <MoreVertical size={18} />
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => setShowInviteModal(true)}
                  >
                    <Key size={16} />
                    My Invite Key
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => setShowAddUserModal(true)}
                  >
                    <UserPlus size={16} />
                    Add User
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Invite Key Preview */}
          <div className="invite-key-preview">
            <div className="title">Your Invite Key:</div>
            <div className="key">{user?.inviteKey || "Loading..."}</div>
            <div className="actions">
              <button
                className="share-button"
                onClick={() => setShowInviteModal(true)}
              >
                Share
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chat List */}
        <div className="chat-list">
          {loading ? (
            <div className="loading-overlay">
              <div className="loading-content">
                <div className="loading-spinner"></div>
                <div className="loading-text">Loading chats...</div>
              </div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <UserPlus size={48} />
              </div>
              <h3>No conversations yet</h3>
              <p>Start chatting by adding someone with their invite key</p>
              <button
                className="add-user-button"
                onClick={() => setShowAddUserModal(true)}
              >
                Add User
              </button>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => onChatSelect(chat)}
                className={`chat-item ${
                  selectedChat?._id === chat._id ? "active" : ""
                }`}
              >
                <div className="chat-avatar-container">
                  <img
                    src={`https://ui-avatars.com/api/?name=${getChatName(
                      chat
                    )}&background=random`}
                    alt={getChatName(chat)}
                    className="chat-avatar"
                  />
                  {isOnline(chat) && (
                    <div className="chat-online-indicator"></div>
                  )}
                </div>

                <div className="chat-info">
                  <div className="chat-header">
                    <h4 className="chat-name">{getChatName(chat)}</h4>
                    <span className="chat-time">
                      {formatMessageTime(chat.updatedAt)}
                    </span>
                  </div>
                  <p className="chat-preview">
                    {getLastMessagePreview(chat)}
                  </p>
                </div>

                <div className="chat-meta">
                  {chat.unreadCount > 0 && (
                    <div className="unread-badge">{chat.unreadCount}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <InviteKeyModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        user={user}
      />

      <AddUserByInvite
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={onNewChat}
      />

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />
    </>
  );
};

export default Sidebar;
