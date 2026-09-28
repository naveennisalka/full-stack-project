const express = require('express');
const { createEvent, getEvents, getEvent, updateEvent, deleteEvent, getOrgEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, upload.single('banner'), createEvent);

router.get('/organizer/:id', protect, getOrgEvents);

router.route('/:id')
  .get(protect, getEvent)
  .put(protect, upload.single('banner'), updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;
