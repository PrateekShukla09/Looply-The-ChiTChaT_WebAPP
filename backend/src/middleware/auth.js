// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//       return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: 'Token is not valid' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = auth;


const jwt = require("jsonwebtoken");
const User = require("../models/User");
const admin = require("../firebaseAdmin");

const auth = async (req, res, next) => {
  try {
    // 1️⃣ Check JWT in Authorization header (email/password login)
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
          return res.status(401).json({ message: "Token is not valid" });
        }

        req.user = user;
        return next();
      } catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
      }
    }

    // 2️⃣ If no JWT, check Firebase session cookie (phone OTP login)
    if (req.cookies?.session) {
      try {
        const decoded = await admin
          .auth()
          .verifySessionCookie(req.cookies.session, true);

        const user = await User.findOne({ firebaseUid: decoded.uid });

        if (!user) {
          return res.status(401).json({ message: "Firebase session not valid" });
        }

        req.user = user;
        return next();
      } catch (err) {
        return res.status(401).json({ message: "Firebase session not valid" });
      }
    }

    // 3️⃣ If neither JWT nor Firebase cookie is found
    return res.status(401).json({ message: "No token or session, authorization denied" });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication error" });
  }
};

module.exports = auth;
