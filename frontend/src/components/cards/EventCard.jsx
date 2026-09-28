import { format } from 'date-fns';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

const EventCard = ({ event, onBook }) => {
  const isFree = event.ticketPrice === 0;
  const seatsRemaining = (event.totalSeats || 0) - (event.registeredCount || 0);
  const isFull = seatsRemaining <= 0;
  
  let statusColor = 'blue';
  if (event.status === 'completed') statusColor = 'gray';
  else if (event.status === 'ongoing') statusColor = 'green';

  return (
    <div className="card overflow-hidden p-0 flex flex-col">
      <div className="h-40 w-full bg-gradient-to-r from-primary-400 to-secondary-500 relative">
        {event.banner && <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />}
        <div className="absolute top-2 right-2">
          <Badge text={event.status || 'upcoming'} color={statusColor} />
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
        <p className="text-primary-600 text-sm font-medium mb-3">
          {event.date ? format(new Date(event.date), 'dd MMM yyyy, p') : 'Date TBD'} • {event.venue}
        </p>
        
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <Avatar src={event.organizer?.avatar} name={event.organizer?.name || 'Org'} size="sm" />
          <span className="text-sm text-gray-600 font-medium">{event.organizer?.name || 'Organizer'}</span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Tickets</p>
            <p className="font-bold text-gray-900">{isFree ? 'Free' : `$${event.ticketPrice}`}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 text-right">Availability</p>
            <p className="font-bold text-gray-900 text-right">{seatsRemaining} left</p>
          </div>
        </div>
        
        {onBook && (
          <button 
            onClick={() => onBook(event)} 
            disabled={isFull || event.status === 'completed'}
            className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors ${
              isFull || event.status === 'completed' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isFull ? 'Sold Out' : 'Book Ticket'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
