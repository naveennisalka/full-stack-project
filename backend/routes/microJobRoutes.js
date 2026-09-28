const express = require('express');
const {
  createMicroJob, getMicroJobs, getMicroJob, updateMicroJob, deleteMicroJob,
  applyForJob, getJobApplications, updateApplicationStatus, completeJob, getMyApplications
} = require('../controllers/microJobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getMicroJobs)
  .post(protect, createMicroJob);

router.get('/my-applications', protect, getMyApplications);

router.route('/:id')
  .get(protect, getMicroJob)
  .put(protect, updateMicroJob)
  .delete(protect, deleteMicroJob);

router.post('/:id/apply', protect, applyForJob);
router.get('/:id/applications', protect, getJobApplications);
router.put('/:id/applications/:appId', protect, updateApplicationStatus);
router.put('/:id/complete', protect, completeJob);

module.exports = router;
