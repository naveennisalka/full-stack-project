const express = require('express');
const { bookTicket, getMyTickets, getTicket, cancelTicket } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/book', protect, bookTicket);
router.get('/my', protect, getMyTickets);
router.route('/:id')
  .get(protect, getTicket)
  .delete(protect, cancelTicket);

module.exports = router;
