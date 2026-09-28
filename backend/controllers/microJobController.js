const MicroJob = require('../db/models/MicroJob');
const JobApplication = require('../db/models/JobApplication');

exports.createMicroJob = async (req, res) => {
  try {
    const { title, description, reward, rewardType, deadline, deliverableType } = req.body;
    
    const job = await MicroJob.create({
      title,
      description,
      reward,
      rewardType,
      deadline,
      deliverableType,
      poster: req.user._id,
      posterModel: req.userModel
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMicroJobs = async (req, res) => {
  try {
    const filter = { status: 'open' };
    if (req.query.deliverableType) filter.deliverableType = req.query.deliverableType;
    
    const jobs = await MicroJob.find(filter)
      .sort({ deadline: 1 })
      .populate('poster', 'name avatar');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMicroJob = async (req, res) => {
  try {
    const job = await MicroJob.findById(req.params.id).populate('poster', 'name avatar');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMicroJob = async (req, res) => {
  try {
    const job = await MicroJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.poster.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMicroJob = async (req, res) => {
  try {
    const job = await MicroJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.poster.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const job = await MicroJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existingApp = await JobApplication.findOne({ job: req.params.id, applicant: req.user._id });
    if (existingApp) return res.status(400).json({ message: 'Already applied' });

    const app = await JobApplication.create({
      job: job._id,
      applicant: req.user._id,
      message: req.body.message,
      deliverableUrl: req.body.deliverableUrl
    });

    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const job = await MicroJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.poster.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    const applications = await JobApplication.find({ job: req.params.id }).populate('applicant', 'name avatar email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await JobApplication.findById(req.params.appId).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeJob = async (req, res) => {
  try {
    const job = await MicroJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.poster.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    job.status = 'completed';
    job.winner = req.body.winnerId;
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ applicant: req.user._id }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
