const express = require('express')
const router = express.Router()
const chat = require('../controllers/chatsController')

router.post('/', chat.addNewChat)
router.get('/:id', chat.getChatList)
router.get('/:userId1/:userId2', chat.getChat)
router.post('/:id', chat.newMessage)

module.exports = router