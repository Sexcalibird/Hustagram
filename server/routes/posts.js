const express = require('express')
const router = express.Router()
const post = require('../controllers/postsController')

router.post('/', post.createPost)

router.get('/', post.getAllPosts)
router.get('/p/:id', post.getPost)
router.get('/:userId',post.getPostsByCreator)

router.get('/home/:userId',post.getHomePosts)
router.get('/explore/:userId',post.getExplorePosts)
router.get('/explore/tags/:tag', post.getExploreTags)
router.get('/saved/:userId', post.getSavedPost)

router.patch('/:id', post.updatePost)
router.delete('/:id', post.deletePost)

router.patch('/:id/like', post.likePost)
router.get('/:id/like/list', post.getUserLike)
router.post('/:id/comment', post.commentPost);
router.get('/:id/comment', post.getCmt);
router.patch('/:id/comment', post.deleteCmt);

module.exports = router