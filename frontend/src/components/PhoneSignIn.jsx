// import React, { useState } from "react";
// import { auth } from "../firebaseConfig";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import axios from "axios";

// function setupRecaptcha() {
//   if (!window.recaptchaVerifier) {
//     window.recaptchaVerifier = new RecaptchaVerifier(
//       "recaptcha-container",
//       {
//         size: "invisible", // or "normal" to show widget
//         callback: (response) => {
//           // reCAPTCHA solved - will be handled by signInWithPhoneNumber
//         },
//         "expired-callback": () => {
//           // reset recaptcha if expired
//         },
//       },
//       auth
//     );
//   }
// }

// export default function PhoneSignIn() {
//   const [phone, setPhone] = useState("+91"); // default to +91, user can change
//   const [otpSent, setOtpSent] = useState(false);
//   const [code, setCode] = useState("");

//   const sendOtp = async () => {
//     try {
//       setupRecaptcha();
//       const appVerifier = window.recaptchaVerifier;
//       const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
//       window.confirmationResult = confirmationResult;
//       setOtpSent(true);
//       alert("OTP sent to " + phone);
//     } catch (err) {
//       console.error("sendOtp error", err);
//       alert(err.message || "Failed to send OTP. Make sure phone is in E.164 format.");
//       if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       const result = await window.confirmationResult.confirm(code);
//       const idToken = await result.user.getIdToken();
//       // Send ID token to backend for verification & create user session
//       await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`, { idToken }, { withCredentials: true });
//       alert("Phone verified & session created!");
//       // redirect to chat or update UI
//     } catch (err) {
//       console.error("verifyOtp error", err);
//       alert("Invalid OTP or error verifying. " + (err?.message || ""));
//     }
//   };

//   return (
//     <div>
//       <h3>Phone Sign In</h3>
//       <div>
//         <label>Phone (E.164):</label>
//         <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+919876543210" />
//         <button onClick={sendOtp}>Send OTP</button>
//         <div id="recaptcha-container" />
//       </div>

//       {otpSent && (
//         <div>
//           <label>Enter OTP:</label>
//           <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
//           <button onClick={verifyOtp}>Verify OTP</button>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";

function setupRecaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          console.warn("reCAPTCHA expired. Please try again.");
          window.recaptchaVerifier = null;
        },
      },
      auth
    );
  }
}

export default function PhoneSignIn() {
  const [phone, setPhone] = useState("+91");
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setMessage("");
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      setMessage(`✅ OTP sent to ${phone}`);
    } catch (err) {
      console.error("sendOtp error", err);
      setMessage(err.message || "❌ Failed to send OTP. Make sure phone is valid.");
      window.recaptchaVerifier = null;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(code);
      const idToken = await result.user.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`,
        { idToken },
        { withCredentials: true }
      );

      setMessage("✅ Phone verified! Redirecting...");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("verifyOtp error", err);
      setMessage("❌ Invalid OTP or verification failed. " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">📱 Phone Sign In</h2>

        {/* Phone input */}
        <div className="auth-input-group">
          <label className="auth-label">Phone (E.164):</label>
          <input
            className="auth-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+919876543210"
            disabled={loading || otpSent}
          />
          <button className="auth-button" onClick={sendOtp} disabled={loading || otpSent}>
            {loading && !otpSent ? "Sending..." : "Send OTP"}
          </button>
        </div>

        {/* OTP input */}
        {otpSent && (
          <div className="auth-input-group">
            <label className="auth-label">Enter OTP:</label>
            <input
              className="auth-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              disabled={loading}
            />
            <button className="auth-button" onClick={verifyOtp} disabled={loading || !code}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <p className={`auth-message ${message.startsWith("❌") ? "error" : "success"}`}>
            {message}
          </p>
        )}

        {/* reCAPTCHA placeholder */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
