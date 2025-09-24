// src/controllers/authController.js
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const admin = require("../firebaseAdmin");

// Generate JWT token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || "7d",
//   });
// };

// Register user
// const register = async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;

    // Validate required fields
    // if (!name || !email || !phone || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please provide name, email, phone, and password",
    //   });
    // }

    // Check if user already exists
    // const existingUser = await User.findOne({
    //   $or: [{ email }, { phone }],
    // });

    // if (existingUser) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "User already exists with this email or phone",
    //   });
    // }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    // const user = await User.create({
    //   name: name.trim(),
    //   email: email.toLowerCase().trim(),
    //   phone: phone.trim(),
    //   password: hashedPassword,
    // });

    // Generate invite key immediately
    // const inviteKey = user.generateInviteKey();
    // const inviteKeyExpiry = new Date();
    // inviteKeyExpiry.setDate(inviteKeyExpiry.getDate() + 30); // 30 days expiry

    // await User.findByIdAndUpdate(user._id, {
    //   inviteKey,
    //   inviteKeyExpiry,
    // });

    // user.inviteKey = inviteKey;

    // Generate token
  //   const token = generateToken(user._id);

  //   res.status(201).json({
  //     success: true,
  //     token,
  //     user: {
  //       id: user._id,
  //       name: user.name,
  //       email: user.email,
  //       phone: user.phone,
  //       avatar: user.avatar,
  //       status: user.status,
  //       inviteKey: user.inviteKey,
  //     },
  //   });
  // } catch (error) {
  //   console.error("Registration error:", error);

    // Handle specific MongoDB errors
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       return res.status(400).json({
//         success: false,
//         message: `User with this ${field} already exists`,
//       });
//     }

//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((err) => err.message);
//       return res.status(400).json({
//         success: false,
//         message: messages.join(", "),
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server error during registration",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Internal server error",
//     });
//   }
// };

// Login user
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

    // Validate required fields
    // if (!email || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please provide email and password",
    //   });
    // }

    // Check if user exists and include password
    // const user = await User.findOne({
    //   email: email.toLowerCase().trim(),
    // }).select("+password");

    // if (!user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid credentials",
    //   });
    // }

    // Check password
    // const isPasswordCorrect = await bcrypt.compare(
    //   password,
    //   user.password || ""
    // );

    // if (!isPasswordCorrect) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid credentials",
    //   });
    // }

    // Update online status
    // await User.findByIdAndUpdate(user._id, {
    //   isOnline: true,
    //   lastSeen: new Date(),
    // });

    // Generate invite key if user doesn't have one or it's expired
    // if (!user.inviteKey || !user.isInviteKeyValid()) {
    //   const inviteKey = user.generateInviteKey();
    //   const inviteKeyExpiry = new Date();
    //   inviteKeyExpiry.setDate(inviteKeyExpiry.getDate() + 30);

    //   await User.findByIdAndUpdate(user._id, {
    //     inviteKey,
    //     inviteKeyExpiry,
    //   });

    //   user.inviteKey = inviteKey;
    // }

    // Generate token
//     const token = generateToken(user._id);

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         avatar: user.avatar,
//         status: user.status,
//         isOnline: true,
//         inviteKey: user.inviteKey,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error during login",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Internal server error",
//     });
//   }
// };

// // -------------------------
// // Firebase Verify (phone OTP flow)
// // -------------------------
// const verifyPhoneAuth = async (req, res) => {
//   const { idToken } = req.body;
//   if (!idToken) {
//     return res.status(400).json({ success: false, message: "Missing idToken" });
//   }

//   try {
//     const decoded = await admin.auth().verifyIdToken(idToken);

//     const uid = decoded.uid;
//     const phone = decoded.phone_number || null;
//     const email = decoded.email || null;

//     let user = await User.findOne({ firebaseUid: uid });
//     if (!user) {
//       user = await User.create({
//         firebaseUid: uid,
//         phone,   // ✅ fixed field
//         email,
//       });
//     }

//     const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
//     const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

//     res.cookie("session", sessionCookie, {
//       maxAge: expiresIn,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//     });

//     return res.json({ success: true, user });
//   } catch (err) {
//     console.error("Phone verify error:", err);
//     return res
//       .status(401)
//       .json({ success: false, message: "Unauthorized", error: err.message });
//   }
// };

// // Get current user
// const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }


//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Not authenticated" });
//     }

//     res.json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         avatar: user.avatar,
//         status: user.status,
//         isOnline: user.isOnline,
//         lastSeen: user.lastSeen,
//         inviteKey: user.inviteKey,
//       },
//     });
//   } catch (error) {
//     console.error("Get user error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Internal server error",
//     });
//   }
// };

// Logout user
// const logout = async (req, res) => {
  // try {
  //   await User.findByIdAndUpdate(req.user.id, {
  //     isOnline: false,
  //     lastSeen: new Date(),
  //   });

  //   res.json({
  //     success: true,
  //     message: "Logged out successfully",
  //   });
  // } catch (error) {
  //   console.error("Logout error:", error);
  //   res.status(500).json({
  //     success: false,
  //     message: "Server error during logout",
  //   });
  // }
    // res.clearCookie("session"); // clear Firebase session if exists
    // res.json({ success: true, message: "Logged out successfully" });
 
// };

// const logout = async (req, res) => {
//   try {
//     if (req.user && req.user._id) {
//       await User.findByIdAndUpdate(req.user._id, {
//         isOnline: false,
//         lastSeen: new Date(),
//       });
//     }
//     res.clearCookie("session");
//     res.json({ success: true, message: "Logged out successfully" });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error during logout",
//     });
//   }
// };


// module.exports = {
//   register,
//   login,
//   verifyPhoneAuth,
//   getMe,
//   logout,
// };




const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const admin = require("../firebaseAdmin");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// -------------------------
// Register (Email/Password)
// -------------------------
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, phone, and password",
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
    });

    // Generate invite key
    const inviteKey = user.generateInviteKey();
    const inviteKeyExpiry = new Date();
    inviteKeyExpiry.setDate(inviteKeyExpiry.getDate() + 30);

    await User.findByIdAndUpdate(user._id, { inviteKey, inviteKeyExpiry });
    user.inviteKey = inviteKey;

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        inviteKey: user.inviteKey,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// -------------------------
// Login (Email/Password)
// -------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    await User.findByIdAndUpdate(user._id, { isOnline: true, lastSeen: new Date() });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        isOnline: true,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// -------------------------
// Verify Firebase Phone OTP
// -------------------------
const verifyPhoneAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: "Missing idToken" });
    }

    // ✅ Verify with Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken);

    const uid = decoded.uid;
    const phone = decoded.phone_number || null;
    const email = decoded.email || `${uid}@firebase.local`;

    // ✅ Find or create user
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        phone,
        email,
        name: decoded.name || "OTP User",
      });
    }

    // ✅ Issue JWT just like email/password
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        isOnline: true,
      },
    });
  } catch (err) {
    console.error("Phone verify error:", err);
    res.status(401).json({ success: false, message: "Invalid OTP token" });
  }
};

// -------------------------
// Get Current User
// -------------------------
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------------
// Logout
// -------------------------
const logout = async (req, res) => {
  try {
    if (req.user && req.user._id) {
      await User.findByIdAndUpdate(req.user._id, { isOnline: false, lastSeen: new Date() });
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error during logout" });
  }
};

module.exports = {
  register,
  login,
  verifyPhoneAuth,
  getMe,
  logout,
};
