// import React, { useState } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { Search, UserPlus, Key, Settings, MoreVertical } from 'lucide-react';
// import InviteKeyModal from './InviteKeyModal';
// import AddUserByInvite from './AddUserByInvite';
// import UserProfileModal from './UserProfileModal';
// import { formatDistanceToNow } from 'date-fns';

// const Sidebar = ({ chats, selectedChat, onChatSelect, onNewChat, loading, user }) => {
//   const [activeTab, setActiveTab] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showInviteModal, setShowInviteModal] = useState(false);
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const tabs = ['All', 'Favorite', 'Groups'];

//   const getChatName = (chat) => {
//     if (chat.isGroupChat) {
//       return chat.name || 'Group Chat';
//     } else {
//       const otherParticipant = chat.participants.find(p => p._id !== user._id);
//       return otherParticipant?.name || 'Unknown User';
//     }
//   };

//   const getChatAvatar = (chat) => {
//     if (chat.isGroupChat) {
//       return chat.groupAvatar || getChatName(chat).charAt(0);
//     } else {
//       const otherParticipant = chat.participants.find(p => p._id !== user._id);
//       return otherParticipant?.avatar || getChatName(chat).charAt(0);
//     }
//   };

//   const getLastMessagePreview = (chat) => {
//     if (!chat.lastMessage) return 'No messages yet';

//     const message = chat.lastMessage;
//     if (message.messageType === 'text') {
//       return message.content;
//     } else {
//       return `📎 ${message.messageType}`;
//     }
//   };

//   const formatMessageTime = (date) => {
//     if (!date) return '';
//     return formatDistanceToNow(new Date(date), { addSuffix: false });
//   };

//   const isOnline = (chat) => {
//     if (chat.isGroupChat) return false;
//     const otherParticipant = chat.participants.find(p => p._id !== user._id);
//     return otherParticipant?.isOnline || false;
//   };
//   const filteredChats = chats.filter(chat => {
//     const searchLower = searchQuery.toLowerCase();
//     const chatName = getChatName(chat).toLowerCase();
//     return chatName.includes(searchLower);
//   });

//   return (
//     <>
//       <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
//         {/* Header */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <img
//                   src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`}
//                   alt={user?.name}
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
//               </div>
//               <div>
//                 <h2 className="font-semibold text-gray-900">{user?.name}</h2>
//                 <p className="text-xs text-gray-500">Online</p>
//               </div>
//             </div>

//             <div className="relative">
//               <button
//                 onClick={() => setShowDropdown(!showDropdown)}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <MoreVertical size={18} className="text-gray-600" />
//               </button>

//               {showDropdown && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
//                   <button
//                     onClick={() => {
//                       setShowInviteModal(true);
//                       setShowDropdown(false);
//                     }}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     <Key size={16} className="mr-3" />
//                     My Invite Key
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowAddUserModal(true);
//                       setShowDropdown(false);
//                     }}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     <UserPlus size={16} className="mr-3" />
//                     Add User
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowProfileModal(true);
//                       setShowDropdown(false);
//                     }}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     <Settings size={16} className="mr-3" />
//                     Settings
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Quick Invite Key Display */}
//           <div className="bg-blue-50 rounded-lg p-3 mb-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs font-medium text-blue-800">Your Invite Key:</p>
//                 <p className="text-sm font-mono text-blue-600">{user?.inviteKey || 'Loading...'}</p>
//               </div>
//               <button
//                 onClick={() => setShowInviteModal(true)}
//                 className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Share
//               </button>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="relative">
//             <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
//                 activeTab === tab
//                   ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
//                   : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Chat List */}
//         <div className="flex-1 overflow-y-auto">
//           {loading ? (
//             <div className="flex items-center justify-center h-32">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             </div>
//           ) : filteredChats.length === 0 ? (
//             <div className="text-center p-8">
//               <div className="text-gray-400 mb-4">
//                 <UserPlus size={48} className="mx-auto" />
//               </div>
//               <p className="text-gray-600 mb-2">No conversations yet</p>
//               <p className="text-sm text-gray-500 mb-4">Start chatting by adding someone with their invite key</p>
//               <button
//                 onClick={() => setShowAddUserModal(true)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Add User
//               </button>
//             </div>
//           ) : (
//             filteredChats.map((chat) => (
//               <div
//                 key={chat._id}
//                 onClick={() => onChatSelect(chat)}
//                 className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                   selectedChat?._id === chat._id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
//                 }`}
//               >
//                 <div className="relative mr-3">
//                   <img
//                     src={`https://ui-avatars.com/api/?name=${getChatName(chat)}&background=random`}
//                     alt={getChatName(chat)}
//                     className="w-12 h-12 rounded-full"
//                   />
//                   {isOnline(chat) && (
//                     <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
//                   )}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-1">
//                     <h3 className="font-semibold text-gray-900 truncate">
//                       {getChatName(chat)}
//                     </h3>
//                     <span className="text-xs text-gray-500">
//                       {formatMessageTime(chat.updatedAt)}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 truncate">
//                     {getLastMessagePreview(chat)}
//                   </p>
//                 </div>

//                 {/* Unread indicator */}
//                 {chat.unreadCount > 0 && (
//                   <div className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {chat.unreadCount}
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       <InviteKeyModal
//         isOpen={showInviteModal}
//         onClose={() => setShowInviteModal(false)}
//         user={user}
//       />

//       <AddUserByInvite
//         isOpen={showAddUserModal}
//         onClose={() => setShowAddUserModal(false)}
//         onUserAdded={onNewChat}
//       />

//       <UserProfileModal
//         isOpen={showProfileModal}
//         onClose={() => setShowProfileModal(false)}
//         user={user}
//       />
//     </>
//   );
// };

// export default Sidebar;

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
  const {logout} = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const tabs = ["All", "Favorite", "Groups"];

  // FIXED: Get correct chat name (other participant's name)
  // const getChatName = (chat) => {
  //   if (chat.isGroupChat) {
  //     return chat.name || 'Group Chat';
  //   } else {
  //     // Find the OTHER participant (not the current user)
  //     const otherParticipant = chat.participants.find(p => p._id !== user._id);
  //     console.log('Chat participants:', chat.participants); // Debug log
  //     console.log('Current user ID:', user._id); // Debug log
  //     console.log('Other participant:', otherParticipant); // Debug log
  //     return otherParticipant?.name || 'Unknown User';
  //   }
  // };
  const currentUserId = user?._id || user?.id;

  const getChatName = (chat) => {
    console.log("Getting chat name for:", chat); // Debug log
    console.log("Participants:", chat.participants); // Debug log
    console.log("Current user ID:", user._id); // Debug log

    if (chat.isGroupChat) {
      return chat.name || "Group Chat";
    } else {
      // Ensure participants is an array and has populated user objects
      if (!chat.participants || !Array.isArray(chat.participants)) {
        return "Unknown Chat";
      }

      // Find the other participant
      const otherParticipant = chat.participants.find((participant) => {
        // Handle both populated and non-populated participant objects
        const participantId =
          typeof participant === "object" ? participant._id : participant;
        return participantId !== currentUserId;
      });

      console.log("Other participant found:", otherParticipant); // Debug log

      if (!otherParticipant) {
        return "Unknown User";
      }

      // Return the name if participant is populated, otherwise 'User'
      return otherParticipant.name || "User";
    }
  };

  // FIXED: Get correct chat avatar
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

  // const getLastMessagePreview = (chat) => {
  //   if (!chat.lastMessage) return "No messages yet";

  //   const message = chat.lastMessage;

  //   // FIXED: Show who sent the message
  //   if (message.messageType === "text") {
  //     const senderName =
  //       message.sender?._id === user._id ? "You" : message.sender?.name;
  //     return `${senderName}: ${message.content}`;
  //   } else {
  //     const senderName =
  //       message.sender?._id === user._id ? "You" : message.sender?.name;
  //     return `${senderName}: 📎 ${message.messageType}`;
  //   }
  // };
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

  // FIXED: Check online status of other participant
  // const isOnline = (chat) => {
  //   if (chat.isGroupChat) return false;
  //   const otherParticipant = chat.participants.find((p) => p._id !== user._id);
  //   return otherParticipant?.isOnline || false;
  // };
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
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff`} alt={user?.name} />
                <div className="online-indicator"></div>
              </div>
              <div className="user-details">
                <h3>{user?.name}</h3>
                <p>Online</p>
              </div>
            </div>

            <div className="header-actions">
              <button className="menu-trigger" onClick={() => setShowDropdown(!showDropdown)}>
                <MoreVertical size={18} />
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => setShowInviteModal(true)}>
                    <Key size={16} />
                    My Invite Key
                  </button>
                  <button className="dropdown-item" onClick={() => setShowAddUserModal(true)}>
                    <UserPlus size={16} />
                    Add User
                  </button>
                  <button className="dropdown-item" onClick={() => setShowProfileModal(true)}>
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
            <div className="key">{user?.inviteKey || 'Loading...'}</div>
            <div className="actions">
              <button className="share-button" onClick={() => setShowInviteModal(true)}>
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
              className={`tab ${activeTab === tab ? 'active' : ''}`}
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
              <button className="add-user-button" onClick={() => setShowAddUserModal(true)}>
                Add User
              </button>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => onChatSelect(chat)}
                className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
              >
                <div className="chat-avatar-container">
                  <img
                    src={`https://ui-avatars.com/api/?name=${getChatName(chat)}&background=random`}
                    alt={getChatName(chat)}
                    className="chat-avatar"
                  />
                  {isOnline(chat) && <div className="chat-online-indicator"></div>}
                </div>
                
                <div className="chat-info">
                  <div className="chat-header">
                    <h4 className="chat-name">{getChatName(chat)}</h4>
                    <span className="chat-time">{formatMessageTime(chat.updatedAt)}</span>
                  </div>
                  <p className="chat-preview">{getLastMessagePreview(chat)}</p>
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

