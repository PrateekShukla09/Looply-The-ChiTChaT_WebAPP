// import React, { useState, useEffect } from 'react';
// import { X, Copy, Share, RefreshCw, Check } from 'lucide-react';
// import { inviteAPI } from '../utils/api';

// const InviteKeyModal = ({ isOpen, onClose, user }) => {
//   const [inviteKey, setInviteKey] = useState('');
//   const [expiryDate, setExpiryDate] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     if (isOpen && user) {
//       fetchInviteKey();
//     }
//   }, [isOpen, user]);

//   const fetchInviteKey = async () => {
//     try {
//       setLoading(true);
//       const response = await inviteAPI.getInviteKey();

//       if (response.data.success) {
//         setInviteKey(response.data.inviteKey);
//         setExpiryDate(response.data.expiresAt);
//       }
//     } catch (error) {
//       if (error.response?.status === 404) {
//         // No invite key exists, generate one
//         generateNewInviteKey();
//       } else {
//         console.error('Error fetching invite key:', error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateNewInviteKey = async () => {
//     try {
//       setLoading(true);
//       const response = await inviteAPI.generateInviteKey();

//       if (response.data.success) {
//         setInviteKey(response.data.inviteKey);
//         setExpiryDate(response.data.expiresAt);
//       }
//     } catch (error) {
//       console.error('Error generating invite key:', error);
//       alert('Failed to generate invite key');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(inviteKey);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (error) {
//       // Fallback for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = inviteKey;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const shareInviteKey = async () => {
//     const shareData = {
//       title: 'Add me on WhatsApp Clone',
//       text: `Use my invite key to add me: ${inviteKey}`,
//       url: window.location.origin
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         copyToClipboard();
//       }
//     } catch (error) {
//       copyToClipboard();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">Your Invite Key</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {loading ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading your invite key...</p>
//             </div>
//           ) : (
//             <>
//               <div className="mb-6">
//                 <p className="text-gray-600 mb-4">
//                   Share this key with others so they can add you to their contacts instantly.
//                 </p>

//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-dashed border-blue-200">
//                   <div className="text-center">
//                     <div className="text-3xl font-mono font-bold text-blue-600 mb-2 tracking-wider">
//                       {inviteKey || 'Loading...'}
//                     </div>
//                     {expiryDate && (
//                       <p className="text-sm text-blue-500">
//                         Expires: {new Date(expiryDate).toLocaleDateString()}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 <button
//                   onClick={copyToClipboard}
//                   disabled={!inviteKey}
//                   className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
//                 >
//                   {copied ? <Check size={18} /> : <Copy size={18} />}
//                   <span>{copied ? 'Copied!' : 'Copy'}</span>
//                 </button>

//                 <button
//                   onClick={shareInviteKey}
//                   disabled={!inviteKey}
//                   className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
//                 >
//                   <Share size={18} />
//                   <span>Share</span>
//                 </button>
//               </div>

//               <button
//                 onClick={generateNewInviteKey}
//                 disabled={loading}
//                 className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
//               >
//                 <RefreshCw size={18} />
//                 <span>Generate New Key</span>
//               </button>

//               <div className="mt-4 p-4 bg-blue-50 rounded-xl">
//                 <p className="text-sm text-blue-700">
//                   <span className="font-semibold">💡 Tip:</span> Generate a new key if you want to revoke access for the current one. The old key will stop working immediately.
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InviteKeyModal;

import React, { useState, useEffect } from "react";
import { X, Copy, Share, RefreshCw, Check } from "lucide-react";
import { inviteAPI } from "../utils/api";
import "../styles/InviteModal.css";

const InviteKeyModal = ({ isOpen, onClose, user }) => {
  const [inviteKey, setInviteKey] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      if (user.inviteKey) {
        setInviteKey(user.inviteKey);
        setExpiryDate(user.inviteKeyExpiry);  
      } else {
        fetchInviteKey(); // Only fetch if not available
      }
    }
  }, [isOpen, user]);

  const fetchInviteKey = async () => {
    try {
      setLoading(true);
      const response = await inviteAPI.getInviteKey();

      if (response.data.success) {
        setInviteKey(response.data.inviteKey);
        setExpiryDate(response.data.expiresAt);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No invite key exists, generate one
        await generateNewInviteKey();
      } else {
        console.error("Error fetching invite key:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateNewInviteKey = async () => {
    try {
      setLoading(true);
      const response = await inviteAPI.generateInviteKey();

      if (response.data.success) {
        setInviteKey(response.data.inviteKey);
        setExpiryDate(response.data.expiresAt);
      }
    } catch (error) {
      console.error("Error generating invite key:", error);
      alert("Failed to generate invite key");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = inviteKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareInviteKey = async () => {
    const shareData = {
      title: "Add me on Looply",
      text: `Use my invite key to add me: ${inviteKey}`,
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        copyToClipboard();
      }
    } catch (error) {
      copyToClipboard();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="invite-modal-overlay">
      <div className="invite-modal">
        <div className="invite-modal-header">
          <h2 className="invite-modal-title">Your Invite Key</h2>
          <button onClick={onClose} className="modal-close-button">
            <X size={24} />
          </button>
        </div>

        <div className="invite-modal-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">Loading your invite key...</p>
            </div>
          ) : (
            <>
              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                Share this key with others so they can add you to their contacts
                instantly.
              </p>

              <div className="invite-key-display">
                <div className="invite-key-text">
                  {inviteKey || "Loading..."}
                </div>
                {expiryDate && (
                  <p className="invite-key-expiry">
                    Expires: {new Date(expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="invite-actions">
                <button
                  onClick={copyToClipboard}
                  disabled={!inviteKey}
                  className={`invite-button copy ${copied ? "copied" : ""}`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  onClick={shareInviteKey}
                  disabled={!inviteKey}
                  className="invite-button share"
                >
                  <Share size={16} />
                  <span>Share</span>
                </button>
              </div>

              <button
                onClick={generateNewInviteKey}
                disabled={loading}
                className="invite-button generate"
              >
                <RefreshCw size={16} />
                <span>Generate New Key</span>
              </button>

              <div className="invite-tip">
                <strong>💡 Tip:</strong> Generate a new key if you want to
                revoke access for the current one. The old key will stop working
                immediately.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteKeyModal;
