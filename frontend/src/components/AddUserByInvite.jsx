// import React, { useState } from 'react';
// import { X, UserPlus, Search } from 'lucide-react';
// import { inviteAPI } from '../utils/api';

// const AddUserByInvite = ({ isOpen, onClose, onUserAdded }) => {
//   const [inviteKey, setInviteKey] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!inviteKey.trim()) {
//       setError('Please enter an invite key');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await inviteAPI.useInviteKey(inviteKey.toUpperCase().trim());

//       if (response.data.success) {
//         setSuccess(`${response.data.user.name} has been added to your contacts!`);
//         setInviteKey('');
        
//         // Notify parent component
//         if (onUserAdded) {
//           onUserAdded(response.data.chat);
//         }

//         // Close modal after success
//         setTimeout(() => {
//           onClose();
//           setSuccess('');
//         }, 2000);
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || 'Failed to add user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     // Allow alphanumeric characters and hyphens, convert to uppercase
//     const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
//     setInviteKey(value);
//     setError('');
//     setSuccess('');
//   };

//   const handlePaste = (e) => {
//     // Handle paste events to clean the pasted content
//     e.preventDefault();
//     const paste = (e.clipboardData || window.clipboardData).getData('text');
//     const cleanPaste = paste.toUpperCase().replace(/[^A-Z0-9-]/g, '');
//     setInviteKey(cleanPaste);
//     setError('');
//     setSuccess('');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
//               <UserPlus size={28} className="text-blue-600" />
//               <span>Add New Contact</span>
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Enter Invite Key
//               </label>
//               <div className="relative">
//                 <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   value={inviteKey}
//                   onChange={handleInputChange}
//                   onPaste={handlePaste}
//                   placeholder="6491E7C4D9DD-MFS5UH38"
//                   className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-lg tracking-wider"
//                   maxLength="25"  // Increased from 15 to 25
//                   required
//                   disabled={loading}
//                 />
//               </div>
//               <div className="mt-2 text-xs text-gray-500 space-y-1">
//                 <p>Ask your friend for their invite key to add them instantly</p>
//                 <p className="font-mono">Format: XXXXXX-XXXXXXXX (up to 25 characters)</p>
//                 <p className="text-blue-600">Current length: {inviteKey.length}/25</p>
//               </div>
//             </div>

//             {error && (
//               <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
//                 <p className="font-medium">Error</p>
//                 <p className="text-sm">{error}</p>
//               </div>
//             )}

//             {success && (
//               <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
//                 <p className="font-medium">Success! 🎉</p>
//                 <p className="text-sm">{success}</p>
//               </div>
//             )}

//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
//                 disabled={loading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading || !inviteKey.trim()}
//                 className="bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium"
//               >
//                 {loading ? 'Adding...' : 'Add Contact'}
//               </button>
//             </div>
//           </form>

//           <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
//             <p className="text-sm text-blue-700">
//               <span className="font-semibold">💡 Tips:</span>
//               <br />• You can paste the full invite key
//               <br />• Keys are case-insensitive 
//               <br />• Only letters, numbers, and hyphens allowed
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddUserByInvite;


import React, { useState } from 'react';
import { X, UserPlus, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { inviteAPI } from '../utils/api';
import '../styles/AddUserModal.css';

const AddUserByInvite = ({ isOpen, onClose, onUserAdded }) => {
  const [inviteKey, setInviteKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!inviteKey.trim()) {
      setError('Please enter an invite key');
      return;
    }

    try {
      setLoading(true);
      const response = await inviteAPI.useInviteKey(inviteKey.toUpperCase().trim());

      if (response.data.success) {
        setSuccess(`${response.data.user.name} has been added to your contacts!`);
        setInviteKey('');
        
        if (onUserAdded) {
          onUserAdded(response.data.chat);
        }

        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setInviteKey(value);
    setError('');
    setSuccess('');
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const cleanPaste = paste.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setInviteKey(cleanPaste);
    setError('');
    setSuccess('');
  };

  if (!isOpen) return null;

  return (
    <div className="add-user-modal-overlay">
      <div className="add-user-modal">
        <div className="add-user-header">
          <div className="add-user-header-content">
            <h2 className="add-user-title">
              <UserPlus size={28} />
              <span>Add New Contact</span>
            </h2>
            <button onClick={onClose} className="add-user-close-button">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="add-user-content">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <label className="form-section-label">Enter Invite Key</label>
              <div className="invite-key-input-container">
                <Search size={18} className="invite-key-input-icon" />
                <input
                  type="text"
                  value={inviteKey}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  placeholder="6491E7C4D9DD-MFS5UH38"
                  className="invite-key-input"
                  maxLength="25"
                  required
                  disabled={loading}
                />
              </div>
              <div className="input-helper-text">
                <div className="helper-item">
                  <span>Ask your friend for their invite key to add them instantly</span>
                </div>
                <div className="helper-item">
                  <span>Format: XXXXXX-XXXXXXXX (up to 25 characters)</span>
                </div>
                <div className={`character-counter ${inviteKey.length > 20 ? 'warning' : ''} ${inviteKey.length > 25 ? 'error' : ''}`}>
                  Current length: {inviteKey.length}/25
                </div>
              </div>
            </div>

            {error && (
              <div className="error-section">
                <div className="error-title">
                  <AlertCircle size={20} />
                  Error
                </div>
                <div className="error-message">{error}</div>
              </div>
            )}

            {success && (
              <div className="success-section">
                <div className="success-title">
                  <CheckCircle size={20} />
                  Success!
                </div>
                <div className="success-message">{success}</div>
              </div>
            )}

            <div className="action-buttons">
              <button
                type="button"
                onClick={onClose}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !inviteKey.trim()}
                className="add-contact-button"
              >
                {loading ? (
                  <div className="loading-button-content">
                    <div className="button-spinner"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  'Add Contact'
                )}
              </button>
            </div>
          </form>

          <div className="tips-section">
            <div className="tips-title">Tips:</div>
            <ul className="tips-list">
              <li>You can paste the full invite key</li>
              <li>Keys are case-insensitive</li>
              <li>Only letters, numbers, and hyphens allowed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserByInvite;