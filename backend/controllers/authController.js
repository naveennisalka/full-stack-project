const User = require('../db/models/User');
const Organization = require('../db/models/Organization');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide all fields' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerOrganization = async (req, res) => {
  try {
    const { name, email, password, category } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide all fields' });

    const orgExists = await Organization.findOne({ email });
    if (orgExists) return res.status(400).json({ message: 'Organization already exists' });

    const org = await Organization.create({ name, email, password, category });
    res.status(201).json({
      _id: org._id,
      name: org.name,
      email: org.email,
      role: org.role,
      token: generateToken(org._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, accountType } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    let account;
    if (accountType === 'organization') {
      account = await Organization.findOne({ email });
    } else {
      account = await User.findOne({ email });
    }

    if (!account || !(await account.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: account._id,
      name: account.name,
      email: account.email,
      role: account.role,
      token: generateToken(account._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out' });
};
