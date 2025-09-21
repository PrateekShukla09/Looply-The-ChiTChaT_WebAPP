const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatMessages,
  markAsRead,
  deleteMessage,
  reactToMessage
} = require('../controllers/messageController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');


router.use(auth); // All message routes require authentication

router.post('/send', upload.single('file'), sendMessage);
router.get('/chat/:chatId', getChatMessages);
router.put('/chat/:chatId/read', markAsRead);
router.delete('/:messageId', deleteMessage);
router.put('/:messageId/react', reactToMessage);

module.exports = router;