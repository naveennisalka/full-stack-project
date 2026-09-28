const Ticket = require('../db/models/Ticket');
const Event = require('../db/models/Event');
const qrcode = require('qrcode');

exports.bookTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.totalSeats > 0 && event.registeredCount >= event.totalSeats) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    const existingTicket = await Ticket.findOne({ event: eventId, holder: req.user._id, status: 'confirmed' });
    if (existingTicket) {
      return res.status(400).json({ message: 'You have already booked a ticket for this event' });
    }

    const ticket = new Ticket({
      event: eventId,
      holder: req.user._id,
      amountPaid: event.isFree ? 0 : event.ticketPrice
    });

    const qrData = await qrcode.toDataURL(ticket.ticketCode);
    ticket.qrCode = qrData;
    await ticket.save();

    event.registeredCount += 1;
    await event.save();

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ holder: req.user._id }).populate('event');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('event');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    if (ticket.holder.toString() !== req.user._id.toString() && req.userModel !== 'Organization') {
       return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    if (ticket.holder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (ticket.status === 'cancelled') {
      return res.status(400).json({ message: 'Ticket already cancelled' });
    }

    ticket.status = 'cancelled';
    await ticket.save();

    const event = await Event.findById(ticket.event);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    res.json({ message: 'Ticket cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
