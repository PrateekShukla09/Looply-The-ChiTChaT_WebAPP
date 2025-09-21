const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error("Authentication error"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Store online users
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log(`User ${socket.user.name} connected`);

    // Add user to online users
    onlineUsers.set(socket.userId, socket.id);

    // Update user online status
    User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date(),
    }).exec();

    // Join user to their rooms (chats)
    socket.on("join-chats", async (chatIds) => {
      try {
        chatIds.forEach((chatId) => {
          socket.join(chatId);
        });
        console.log(`User ${socket.user.name} joined chats:`, chatIds);
      } catch (error) {
        console.error("Error joining chats:", error);
      }
    });

    // Handle sending messages
    socket.on("send-message", async (messageData) => {
      try {
        const { chatId, content, messageType, replyTo } = messageData;

        // Create message (you might want to validate chat participation here)
        const Message = require("../models/Message");
        const Chat = require("../models/Chat");

        const message = await Message.create({
          sender: socket.userId,
          chat: chatId,
          content,
          messageType: messageType || "text",
          replyTo: replyTo || null,
        });

        // Update chat's last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          updatedAt: new Date(),
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name avatar")
          .populate("replyTo", "content sender messageType");

        // Emit to all users in the chat
        io.to(chatId).emit("new-message", populatedMessage);

        // Send delivery confirmation to sender
        socket.emit("message-delivered", {
          messageId: message._id,
          chatId,
        });
      } catch (error) {
        socket.emit("message-error", {
          error: error.message,
        });
      }
    });

    // Handle message read receipts
    socket.on("mark-messages-read", async ({ chatId, messageIds }) => {
      try {
        const Message = require("../models/Message");

        await Message.updateMany(
          {
            _id: { $in: messageIds },
            chat: chatId,
            sender: { $ne: socket.userId },
          },
          {
            $addToSet: {
              readBy: {
                user: socket.userId,
                readAt: new Date(),
              },
            },
          }
        );

        // Notify other users in chat about read receipts
        socket.to(chatId).emit("messages-read", {
          chatId,
          messageIds,
          readBy: socket.userId,
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Handle typing indicators
    socket.on("typing-start", ({ chatId }) => {
      socket.to(chatId).emit("user-typing", {
        userId: socket.userId,
        userName: socket.user.name,
        chatId,
      });
    });

    socket.on("typing-stop", ({ chatId }) => {
      socket.to(chatId).emit("user-stop-typing", {
        userId: socket.userId,
        chatId,
      });
    });

    // Handle message reactions
    socket.on("react-to-message", async ({ messageId, emoji }) => {
      try {
        const Message = require("../models/Message");
        const message = await Message.findById(messageId);

        if (message) {
          // Remove existing reaction from this user
          message.reactions = message.reactions.filter(
            (r) => r.user.toString() !== socket.userId
          );

          // Add new reaction if emoji provided
          if (emoji) {
            message.reactions.push({
              user: socket.userId,
              emoji,
              createdAt: new Date(),
            });
          }

          await message.save();

          // Emit reaction update to all users in the chat
          io.to(message.chat.toString()).emit("message-reaction", {
            messageId,
            reactions: message.reactions,
            userId: socket.userId,
            emoji,
          });
        }
      } catch (error) {
        console.error("Error handling reaction:", error);
      }
    });

    // Handle user status updates
    socket.on("update-status", async ({ status }) => {
      try {
        await User.findByIdAndUpdate(socket.userId, { status });

        // Broadcast status update to contacts
        const user = await User.findById(socket.userId).populate(
          "contacts.user"
        );
        user.contacts.forEach((contact) => {
          const contactSocketId = onlineUsers.get(contact.user._id.toString());
          if (contactSocketId) {
            io.to(contactSocketId).emit("contact-status-updated", {
              userId: socket.userId,
              status,
            });
          }
        });
      } catch (error) {
        console.error("Error updating status:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`User ${socket.user.name} disconnected`);

      // Remove from online users
      onlineUsers.delete(socket.userId);

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      // Broadcast offline status to contacts
      // try {
      //   const user = await User.findById(socket.userId).populate(
      //     "contacts.user"
      //   );
      //   user.contacts.forEach((contact) => {
      //     const contactSocketId = onlineUsers.get(contact.user._id.toString());
      //     if (contactSocketId) {
      //       io.to(contactSocketId).emit("contact-offline", {
      //         userId: socket.userId,
      //         lastSeen: new Date(),
      //       });
      //     }
      //   });
      // } catch (error) {
      //   console.error("Error broadcasting offline status:", error);
      // }
      // Broadcast offline status to contacts
      try {
        const user = await User.findById(socket.userId).populate(
          "contacts.user"
        );

        if (!user) {
          console.warn(`User not found during disconnect: ${socket.userId}`);
          return;
        }

        if (user.contacts && user.contacts.length > 0) {
          user.contacts.forEach((contact) => {
            if (!contact?.user?._id) return; // safety check

            const contactSocketId = onlineUsers.get(
              contact.user._id.toString()
            );
            if (contactSocketId) {
              io.to(contactSocketId).emit("contact-offline", {
                userId: socket.userId,
                lastSeen: new Date(),
              });
            }
          });
        }
      } catch (error) {
        console.error("Error broadcasting offline status:", error);
      }
    });
  });

  return io;
};

module.exports = initializeSocket;
