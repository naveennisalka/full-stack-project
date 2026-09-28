const Organization = require('../db/models/Organization');

exports.getOrgProfile = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).populate('members', 'name avatar').select('-password');
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrgProfile = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    
    if (req.user._id.toString() !== org._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    org.name = req.body.name || org.name;
    org.description = req.body.description || org.description;
    org.category = req.body.category || org.category;
    org.website = req.body.website || org.website;
    org.contactEmail = req.body.contactEmail || org.contactEmail;

    if (req.files && req.files.avatar) {
      org.avatar = `/uploads/${req.files.avatar[0].filename}`;
    }
    if (req.files && req.files.coverImage) {
      org.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    const updatedOrg = await org.save();
    res.json(updatedOrg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followOrg = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    if (!org.followers.includes(req.user._id)) {
      org.followers.push(req.user._id);
      await org.save();
    }
    res.json({ message: 'Organization followed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfollowOrg = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    org.followers = org.followers.filter(id => id.toString() !== req.user._id.toString());
    await org.save();
    res.json({ message: 'Organization unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchOrgs = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const orgs = await Organization.find({ ...keyword }).select('-password');
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
