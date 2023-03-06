const express = require('express')
const router = express.Router()
const ntfc = require('../controllers/notificationsController')

router.get('/:id', ntfc.getNotifications)
router.post('/:id', ntfc.newNotification)

module.exports = router