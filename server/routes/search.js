const express = require('express')
const router = express.Router()
const search = require('../controllers/searchController')

router.get('/', search.searchResult)
router.post('/history/:id', search.addHistory)
router.get('/history/:id', search.searchHistory)
router.patch('/history/:id', search.deleteHistory)

module.exports = router