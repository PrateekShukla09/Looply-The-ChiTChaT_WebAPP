const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Search users
router.get("/search", auth, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        message: "Query must be at least 2 characters long",
      });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
            { phone: { $regex: query, $options: "i" } },
          ],
        },
      ],
    })
      .select("name email phone avatar status isOnline lastSeen")
      .limit(20);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get user profile
router.get("/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "name email phone avatar status isOnline lastSeen"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, status } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (status) updates.status = status;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Add contact
router.post("/contacts/add", auth, async (req, res) => {
  try {
    const { userId, name } = req.body;

    const user = await User.findById(req.user.id);
    const contactExists = user.contacts.some(
      (contact) => contact.user.toString() === userId
    );

    if (contactExists) {
      return res.status(400).json({
        message: "Contact already exists",
      });
    }

    user.contacts.push({
      user: userId,
      name: name,
    });

    await user.save();

    const updatedUser = await User.findById(req.user.id).populate(
      "contacts.user",
      "name email phone avatar isOnline lastSeen"
    );

    res.json({
      success: true,
      contacts: updatedUser.contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get contacts
router.get("/contacts/list", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "contacts.user",
      "name email phone avatar isOnline lastSeen"
    );

    res.json({
      success: true,
      contacts: user.contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Generate new invite key
router.post("/invite-key/generate", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const inviteKey = user.generateInviteKey();
    const inviteKeyExpiry = new Date();
    inviteKeyExpiry.setDate(inviteKeyExpiry.getDate() + 30); // 30 days expiry

    await User.findByIdAndUpdate(req.user.id, {
      inviteKey,
      inviteKeyExpiry,
    });

    res.json({
      success: true,
      inviteKey,
      expiresAt: inviteKeyExpiry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get current invite key
router.get("/invite-key", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.inviteKey || !user.isInviteKeyValid()) {
      return res.status(404).json({
        message: "No valid invite key found",
      });
    }

    res.json({
      success: true,
      inviteKey: user.inviteKey,
      expiresAt: user.inviteKeyExpiry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Use invite key to add user
router.post("/invite-key/use", auth, async (req, res) => {
  try {
    const { inviteKey } = req.body;
    const currentUserId = req.user.id;

    if (!inviteKey) {
      return res.status(400).json({
        message: "Invite key is required",
      });
    }

    // Find user by invite key
    const targetUser = await User.findOne({ inviteKey });

    if (!targetUser) {
      return res.status(404).json({
        message: "Invalid invite key",
      });
    }

    // Check if invite key is valid (not expired)
    if (!targetUser.isInviteKeyValid()) {
      return res.status(400).json({
        message: "Invite key has expired",
      });
    }

    // Check if user is trying to add themselves
    if (targetUser._id.toString() === currentUserId) {
      return res.status(400).json({
        message: "Cannot use your own invite key",
      });
    }

    // Check if target user allows invites
    if (!targetUser.allowInvites) {
      return res.status(403).json({
        message: "This user has disabled invites",
      });
    }

    // Check if user is blocked
    if (targetUser.blockedUsers.includes(currentUserId)) {
      return res.status(403).json({
        message: "You are blocked by this user",
      });
    }

    // Create or get existing chat
    const Chat = require("../models/Chat");
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: {
        $all: [currentUserId, targetUser._id],
        $size: 2,
      },
    })
      .populate("participants", "name email phone avatar isOnline lastSeen")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      });

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [currentUserId, targetUser._id],
        isGroupChat: false,
      });

      // IMPORTANT: Re-populate after creation
      chat = await Chat.findById(chat._id)
        .populate("participants", "name email phone avatar isOnline lastSeen")
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
            select: "name avatar",
          },
        });
    }

    // Add to contacts for both users
    const currentUser = await User.findById(currentUserId);

    // Add target user to current user's contacts if not already added
    const targetUserInContacts = currentUser.contacts.some(
      (contact) => contact.user.toString() === targetUser._id.toString()
    );

    if (!targetUserInContacts) {
      currentUser.contacts.push({
        user: targetUser._id,
        name: targetUser.name,
      });
      await currentUser.save();
    }

    // Add current user to target user's contacts if not already added
    const currentUserInTargetContacts = targetUser.contacts.some(
      (contact) => contact.user.toString() === currentUserId
    );

    if (!currentUserInTargetContacts) {
      targetUser.contacts.push({
        user: currentUserId,
        name: currentUser.name,
      });
      await targetUser.save();
    }

    res.json({
      success: true,
      message: "User added successfully",
      chat,
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        avatar: targetUser.avatar,
        status: targetUser.status,
        isOnline: targetUser.isOnline,
        lastSeen: targetUser.lastSeen,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Toggle invite acceptance
router.put("/invite-settings", auth, async (req, res) => {
  try {
    const { allowInvites } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      allowInvites: allowInvites,
    });

    res.json({
      success: true,
      message: "Invite settings updated",
      allowInvites,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Revoke invite key
router.delete("/invite-key", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $unset: { inviteKey: 1, inviteKeyExpiry: 1 },
    });

    res.json({
      success: true,
      message: "Invite key revoked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
