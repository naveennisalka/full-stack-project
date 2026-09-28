const express = require('express');
const { getNotifications, getUnreadCount, markAllAsRead, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllAsRead);
router.route('/:id')
  .delete(protect, deleteNotification);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
