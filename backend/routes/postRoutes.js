const express = require('express');
const { createPost, getFeed, getPost, updatePost, deletePost, likePost, commentPost, getUserPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getFeed)
  .post(protect, upload.array('images', 5), createPost);

router.get('/user/:userId', protect, getUserPosts);

router.route('/:id')
  .get(protect, getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);

module.exports = router;
