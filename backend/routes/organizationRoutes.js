const express = require('express');
const { getOrgProfile, updateOrgProfile, followOrg, unfollowOrg, searchOrgs } = require('../controllers/organizationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/search', protect, searchOrgs);
router.get('/:id', protect, getOrgProfile);
router.put('/:id', protect, upload.fields([{name:'avatar',maxCount:1},{name:'coverImage',maxCount:1}]), updateOrgProfile);
router.post('/:id/follow', protect, followOrg);
router.delete('/:id/follow', protect, unfollowOrg);

module.exports = router;
