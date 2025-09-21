const Message = require('../models/Message');
const Chat = require('../models/Chat');
const { deleteFile, getFileInfo } = require('../middleware/upload');
const { formatFileSize } = require('../utils/fileHelpers');

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId, content, messageType = 'text', replyTo } = req.body;
    const senderId = req.user.id;

    // Verify chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: senderId
    });

    if (!chat) {
      return res.status(404).json({
        message: 'Chat not found or access denied'
      });
    }

    // Create message
    const messageData = {
      sender: senderId,
      chat: chatId,
      content,
      messageType
    };

    if (replyTo) {
      messageData.replyTo = replyTo;
    }

    // Handle file upload if present
    if (req.file && messageType !== 'text') {
      messageData.media = {
        url: req.file.path,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }

    const message = await Message.create(messageData);

    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });

    // Populate message details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('replyTo', 'content sender messageType');

    // Mark as delivered for all participants except sender
    const deliveredTo = chat.participants
      .filter(p => p.toString() !== senderId)
      .map(p => ({ user: p, deliveredAt: new Date() }));

    await Message.findByIdAndUpdate(message._id, {
      deliveredTo
    });

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get chat messages
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Verify user is participant of the chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(404).json({
        message: 'Chat not found or access denied'
      });
    }

    const messages = await Message.find({
      chat: chatId,
      deletedFor: { $ne: userId }
    }).populate('sender', 'name avatar')
      .populate('replyTo', 'content sender messageType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Update all unread messages in the chat
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        'readBy.user': { $ne: userId }
      },
      {
        $addToSet: {
          readBy: {
            user: userId,
            readAt: new Date()
          }
        }
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteFor = 'me' } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    if (deleteFor === 'everyone') {
      // Only sender can delete for everyone within 7 minutes
      if (message.sender.toString() !== userId) {
        return res.status(403).json({
          message: 'Only sender can delete message for everyone'
        });
      }

      const timeDiff = Date.now() - message.createdAt.getTime();
      if (timeDiff > 7 * 60 * 1000) { // 7 minutes
        return res.status(400).json({
          message: 'Can only delete for everyone within 7 minutes'
        });
      }

      await Message.findByIdAndUpdate(messageId, {
        isDeleted: true,
        content: 'This message was deleted',
        media: null
      });
    } else {
      // Delete for current user only
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { deletedFor: userId }
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// React to message
const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      r => r.user.toString() !== userId
    );

    // Add new reaction if emoji provided
    if (emoji) {
      message.reactions.push({
        user: userId,
        emoji,
        createdAt: new Date()
      });
    }

    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('reactions.user', 'name avatar');

    res.json({
      success: true,
      message: updatedMessage
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getChatMessages,
  markAsRead,
  deleteMessage,
  reactToMessage
};