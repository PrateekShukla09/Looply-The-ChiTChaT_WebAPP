const express = require('express');
const router = express.Router();
const {
  createOrGetChat,
  createGroupChat,
  getUserChats,
  addParticipants,
  removeParticipant
} = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.use(auth); // All chat routes require authentication

router.post('/create', createOrGetChat);
router.post('/group/create', createGroupChat);
router.get('/my-chats', getUserChats);
router.put('/:chatId/participants/add', addParticipants);
router.delete('/:chatId/participants/:userId', removeParticipant);

module.exports = router;