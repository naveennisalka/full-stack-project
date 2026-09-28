const Event = require('../db/models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, endDate, venue, ticketPrice, totalSeats, tags, category, isFree } = req.body;
    
    let banner = '';
    if (req.file) banner = `/uploads/${req.file.filename}`;

    const event = await Event.create({
      title,
      description,
      organizer: req.user._id,
      organizerModel: req.userModel,
      banner,
      date,
      endDate,
      venue,
      ticketPrice: isFree === 'true' || isFree === true ? 0 : ticketPrice,
      totalSeats,
      tags: tags ? JSON.parse(tags) : [],
      category,
      isFree: isFree === 'true' || isFree === true
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .populate('organizer', 'name avatar');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name avatar');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const fields = ['title', 'description', 'date', 'endDate', 'venue', 'ticketPrice', 'totalSeats', 'category', 'status', 'isFree'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    if (req.body.tags) event.tags = JSON.parse(req.body.tags);
    if (req.file) event.banner = `/uploads/${req.file.filename}`;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrgEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.params.id })
      .sort({ date: 1 })
      .populate('organizer', 'name avatar');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
