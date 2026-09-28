const express = require('express');
const {
  createLostItem, getLostItems, getLostItem, resolveLostItem, deleteLostItem,
  createDonation, getDonations, getDonation, donate
} = require('../controllers/lostDonationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/lost')
  .get(protect, getLostItems)
  .post(protect, upload.single('photo'), createLostItem);

router.route('/lost/:id')
  .get(protect, getLostItem)
  .delete(protect, deleteLostItem);

router.put('/lost/:id/resolve', protect, resolveLostItem);

router.route('/donations')
  .get(protect, getDonations)
  .post(protect, upload.single('photo'), createDonation);

router.get('/donations/:id', protect, getDonation);
router.post('/donations/:id/donate', protect, donate);

module.exports = router;
