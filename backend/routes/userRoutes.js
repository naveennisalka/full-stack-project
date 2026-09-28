const express = require('express');
const { getUserProfile, updateUserProfile, followUser, unfollowUser, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, upload.single('avatar'), updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

module.exports = router;
