const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Create or get one-on-one chat
const createOrGetChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({
        message: 'Cannot create chat with yourself'
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: {
        $all: [currentUserId, userId],
        $size: 2
      }
    }).populate('participants', 'name email phone avatar isOnline lastSeen')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'name avatar'
        }
      });

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [currentUserId, userId],
        isGroupChat: false
      });

      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email phone avatar isOnline lastSeen')
        .populate({
          path: 'lastMessage',
          populate: {
            path: 'sender',
            select: 'name avatar'
          }
        });
    }

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Create group chat
const createGroupChat = async (req, res) => {
  try {
    const { name, participants, description } = req.body;
    const currentUserId = req.user.id;

    if (!participants || participants.length < 2) {
      return res.status(400).json({
        message: 'Group chat must have at least 2 participants'
      });
    }

    // Add current user to participants if not included
    const allParticipants = [...new Set([currentUserId, ...participants])];

    const chat = await Chat.create({
      name,
      isGroupChat: true,
      participants: allParticipants,
      admins: [currentUserId],
      createdBy: currentUserId,
      groupDescription: description
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('admins', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      chat: populatedChat
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user's chats
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    }).populate('participants', 'name email phone avatar isOnline lastSeen') // ← Make sure this is correct
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'name avatar'
        }
      })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      chats
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Add participants to group
const addParticipants = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { participants } = req.body;
    const currentUserId = req.user.id;

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.isGroupChat) {
      return res.status(404).json({
        message: 'Group chat not found'
      });
    }

    // Check if user is admin
    if (!chat.admins.includes(currentUserId)) {
      return res.status(403).json({
        message: 'Only admins can add participants'
      });
    }

    // Add new participants
    const newParticipants = participants.filter(p => !chat.participants.includes(p));
    chat.participants.push(...newParticipants);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('admins', 'name email avatar');

    res.json({
      success: true,
      chat: updatedChat
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Remove participant from group
const removeParticipant = async (req, res) => {
  try {
    const { chatId, userId } = req.params;
    const currentUserId = req.user.id;

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.isGroupChat) {
      return res.status(404).json({
        message: 'Group chat not found'
      });
    }

    // Check if user is admin or removing themselves
    if (!chat.admins.includes(currentUserId) && currentUserId !== userId) {
      return res.status(403).json({
        message: 'Only admins can remove participants'
      });
    }

    // Remove participant
    chat.participants = chat.participants.filter(p => p.toString() !== userId);
    chat.admins = chat.admins.filter(a => a.toString() !== userId);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'name email avatar isOnline lastSeen')
      .populate('admins', 'name email avatar');

    res.json({
      success: true,
      chat: updatedChat
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createOrGetChat,
  createGroupChat,
  getUserChats,
  addParticipants,
  removeParticipant
};