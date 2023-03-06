const express = require('express')
const router = express.Router()
const user = require('../controllers/usersController')

router.get('/:username', user.getProfile)

router.patch('/:id/edit', user.updateUser)
router.patch('/:id/ava', user.updateAvatar)
router.patch('/:id/pwd', user.updatePassword)

router.patch('/:id/follow', user.followUser)
router.patch('/:id/save', user.savePost)

router.get('/:id/suggestion', user.getSuggestion)
router.get('/:id/followers', user.getFollowers)
router.get('/:id/followings', user.getFollowings)

module.exports = router