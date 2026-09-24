const express = require('express');
const router = express.Router();
const {
  getBookmarks,
  addBookmark,
  removeBookmark
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All bookmark routes are protected

router.route('/')
  .get(getBookmarks)
  .post(addBookmark);

router.route('/:id')
  .delete(removeBookmark);

module.exports = router;
