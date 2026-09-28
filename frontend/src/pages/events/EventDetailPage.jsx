import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { getEvent } from '../../api/eventApi';
import { bookTicket } from '../../api/ticketApi';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TicketCard from '../../components/cards/TicketCard';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    getEvent(id).then(res => setEvent(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    setBooking(true);
    try {
      const res = await bookTicket({ eventId: id });
      setTicket(res.data.ticket);
      toast.success('Ticket booked successfully!');
      setEvent(prev => ({ ...prev, registeredCount: (prev.registeredCount || 0) + 1 }));
    } catch (err) {
      toast.error('Failed to book ticket');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return <div>Event not found</div>;

  const isFree = event.ticketPrice === 0;
  const seatsRemaining = (event.totalSeats || 0) - (event.registeredCount || 0);
  const isFull = seatsRemaining <= 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card overflow-hidden p-0">
        <div className="h-64 w-full bg-gradient-to-r from-primary-500 to-secondary-500">
          {event.banner && <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />}
        </div>
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <Badge text={event.category || 'Event'} color="purple" />
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={event.organizer?.avatar} name={event.organizer?.name || 'Org'} />
            <div>
              <p className="font-medium text-gray-900">{event.organizer?.name}</p>
              <p className="text-sm text-gray-500">Organizer</p>
            </div>
          </div>

          <p className="text-gray-700 whitespace-pre-wrap mb-8">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Date & Time</p>
              <p className="font-medium text-gray-900">{event.date ? format(new Date(event.date), 'PPPP, p') : 'TBD'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Location</p>
              <p className="font-medium text-gray-900">{event.venue}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ticket Price</p>
              <p className="font-medium text-gray-900">{isFree ? 'Free' : `$${event.ticketPrice}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Availability</p>
              <p className="font-medium text-gray-900">{seatsRemaining} / {event.totalSeats} seats remaining</p>
            </div>
          </div>

          {!ticket ? (
            <button 
              onClick={() => setShowConfirm(true)} 
              disabled={isFull || event.status === 'completed' || booking}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${
                isFull || event.status === 'completed' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {booking ? <LoadingSpinner size="sm" /> : isFull ? 'Sold Out' : 'Book Ticket Now'}
            </button>
          ) : (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Your Ticket</h3>
              <TicketCard ticket={{...ticket, event}} />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleBook}
        title="Confirm Booking"
        message={`Are you sure you want to book a ticket for "${event.title}"? ${!isFree ? `Amount to pay: $${event.ticketPrice}` : 'This is a free event.'}`}
      />
    </div>
  );
};

export default EventDetailPage;
