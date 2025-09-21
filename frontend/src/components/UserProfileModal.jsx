// import React, { useState, useEffect } from 'react';
// import { X, Settings, Key, Shield, User, Phone, Mail } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth';
// import { inviteAPI } from '../utils/api';
// import InviteKeyModal from './InviteKeyModal';
// import '../styles/ProfileSettings.css';

// const UserProfileModal = ({ isOpen, onClose, user }) => {
//   const { logout } = useAuth();
//   const [showInviteKeyModal, setShowInviteKeyModal] = useState(false);
//   const [allowInvites, setAllowInvites] = useState(true);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setAllowInvites(user.allowInvites !== false);
//     }
//   }, [user]);

//   const toggleInviteSettings = async () => {
//     try {
//       setLoading(true);
//       const response = await inviteAPI.updateInviteSettings(!allowInvites);
      
//       if (response.data.success) {
//         setAllowInvites(!allowInvites);
//       }
//     } catch (error) {
//       console.error('Error updating invite settings:', error);
//       alert('Failed to update settings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen || !user) return null;

//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
//                 <Settings size={28} className="text-blue-600" />
//                 <span>Profile & Settings</span>
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* User Info */}
//             <div className="text-center mb-8">
//               <div className="relative inline-block">
//                 <img
//                   src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff&size=80`}
//                   alt={user?.name}
//                   className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg"
//                 />
//                 <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-4 border-white rounded-full"></div>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h3>
//               <div className="space-y-2 text-sm text-gray-600">
//                 <div className="flex items-center justify-center space-x-2">
//                   <Mail size={16} />
//                   <span>{user?.email}</span>
//                 </div>
//                 <div className="flex items-center justify-center space-x-2">
//                   <Phone size={16} />
//                   <span>{user?.phone}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Settings */}
//             <div className="space-y-3 mb-6">
//               <button
//                 onClick={() => setShowInviteKeyModal(true)}
//                 className="w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-100"
//               >
//                 <Key className="text-blue-600 flex-shrink-0" size={24} />
//                 <div className="text-left flex-1">
//                   <p className="font-semibold text-blue-800">My Invite Key</p>
//                   <p className="text-sm text-blue-600">Share with others to let them add you</p>
//                   <p className="text-xs font-mono text-blue-500 mt-1">{user?.inviteKey}</p>
//                 </div>
//               </button>

//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
//                 <div className="flex items-center space-x-4">
//                   <Shield className="text-gray-600 flex-shrink-0" size={24} />
//                   <div>
//                     <p className="font-semibold text-gray-800">Allow Invites</p>
//                     <p className="text-sm text-gray-600">Let others add you using invite keys</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={toggleInviteSettings}
//                   disabled={loading}
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                     allowInvites ? 'bg-blue-600' : 'bg-gray-300'
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                       allowInvites ? 'translate-x-6' : 'translate-x-1'
//                     }`}
//                   />
//                 </button>
//               </div>

//               <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                 <div className="flex items-center space-x-4 mb-2">
//                   <User className="text-gray-600 flex-shrink-0" size={24} />
//                   <div>
//                     <p className="font-semibold text-gray-800">Status Message</p>
//                     <p className="text-sm text-gray-600">{user?.status || 'Hey there! I am using Looply.'}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Logout Button */}
//             <button
//               onClick={() => {
//                 logout();
//                 onClose();
//               }}
//               className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors font-medium"
//             >
//               Sign Out
//             </button>
//           </div>
//         </div>
//       </div>

//       <InviteKeyModal
//         isOpen={showInviteKeyModal}
//         onClose={() => setShowInviteKeyModal(false)}
//         user={user}
//       />
//     </>
//   );
// };

// export default UserProfileModal;


import React, { useState, useEffect } from 'react';
import { X, Settings, Key, Shield, User, Phone, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { inviteAPI } from '../utils/api';
import InviteKeyModal from './InviteKeyModal';
import '../styles/ProfileSettings.css';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const { logout } = useAuth();
  const [showInviteKeyModal, setShowInviteKeyModal] = useState(false);
  const [allowInvites, setAllowInvites] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setAllowInvites(user.allowInvites !== false);
    }
  }, [user]);

  const toggleInviteSettings = async () => {
    try {
      setLoading(true);
      const response = await inviteAPI.updateInviteSettings(!allowInvites);
      
      if (response.data.success) {
        setAllowInvites(!allowInvites);
      }
    } catch (error) {
      console.error('Error updating invite settings:', error);
      alert('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="profile-modal-overlay">
        <div className="profile-modal">
          <div className="profile-header">
            <div className="profile-header-content">
              <h2 className="profile-title">
                <Settings size={28} />
                <span>Profile & Settings</span>
              </h2>
              <button onClick={onClose} className="profile-close-button">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="profile-user-section">
            <div className="profile-avatar-container">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3B82F6&color=fff&size=100`}
                alt={user?.name}
                className="profile-avatar"
              />
              <div className="profile-status-indicator"></div>
            </div>
            <h3 className="profile-user-name">{user?.name}</h3>
            <div className="profile-user-contact">
              <div className="contact-item">
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>{user?.phone}</span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="profile-content">
            <div className="profile-section">
              <button
                onClick={() => setShowInviteKeyModal(true)}
                className="section-button invite-key"
              >
                <div className="section-icon key">
                  <Key size={24} />
                </div>
                <div className="section-content">
                  <h4 className="section-title">My Invite Key</h4>
                  <p className="section-description">Share with others to let them add you</p>
                  <div className="invite-key-display">{user?.inviteKey}</div>
                </div>
              </button>
            </div>

            <div className="profile-section">
              <div className="toggle-container">
                <div className="toggle-content">
                  <div className="section-icon shield">
                    <Shield size={24} />
                  </div>
                  <div className="section-content">
                    <h4 className="section-title">Allow Invites</h4>
                    <p className="section-description">Let others add you using invite keys</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={allowInvites}
                    onChange={toggleInviteSettings}
                    disabled={loading}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="profile-section">
              <div className="status-section">
                <div className="section-icon user">
                  <User size={24} />
                </div>
                <div className="section-content">
                  <h4 className="section-title">Status Message</h4>
                  <p className="status-text">{user?.status || 'Hey there! I am using WhatsApp Clone.'}</p>
                </div>
              </div>
            </div>

            <button onClick={() => { logout(); onClose(); }} className="signout-button">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <InviteKeyModal
        isOpen={showInviteKeyModal}
        onClose={() => setShowInviteKeyModal(false)}
        user={user}
      />
    </>
  );
};

export default UserProfileModal;