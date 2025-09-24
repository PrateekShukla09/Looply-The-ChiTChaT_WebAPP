// const express = require('express');
// const router = express.Router();
// const { register, login, getMe, logout } = require('../controllers/authController');
// const auth = require('../middleware/auth');

// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', auth, getMe);
// router.post('/logout', auth, logout);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  verifyPhoneAuth,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

// -------------------------------
// Email/Password Auth Routes
// -------------------------------
router.post("/register", register);
router.post("/login", login);

// -------------------------------
// Firebase Phone OTP Auth
// -------------------------------
router.post("/verify", verifyPhoneAuth);

// -------------------------------
// Common Auth Routes
// -------------------------------
router.get("/me", auth, getMe);
router.post("/logout", auth, logout);

// 🔹 Optional: clear Firebase session cookie only
router.post("/firebase-logout", (req, res) => {
  res.clearCookie("session");
  return res.json({ success: true });
});

module.exports = router;
