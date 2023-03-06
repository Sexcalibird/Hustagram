const express = require('express')
const router = express.Router()
const admin = require('../controllers/adminController')

router.get('/', admin.getStatistics)
router.get('/users', admin.getAllUsers)
router.get('/perMonth', admin.getPerMonth)
router.delete('/:id', admin.deleteUser)
router.patch('/:id', admin.editUser)
router.patch('/:id/ban', admin.banUser)

module.exports = router