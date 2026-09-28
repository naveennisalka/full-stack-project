import { format } from 'date-fns';
import Badge from '../common/Badge';

const TicketCard = ({ ticket, onCancel }) => {
  let statusColor = 'green';
  if (ticket.status === 'cancelled') statusColor = 'red';
  else if (ticket.status === 'used') statusColor = 'gray';

  return (
    <div className="card flex flex-col md:flex-row gap-4 border-l-4 border-l-primary-500 relative overflow-hidden">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{ticket.event?.title || 'Event'}</h3>
          <Badge text={ticket.status || 'confirmed'} color={statusColor} />
        </div>
        
        <div className="space-y-1 mb-4 text-sm text-gray-600">
          <p>📅 {ticket.event?.date ? format(new Date(ticket.event.date), 'dd MMM yyyy, p') : 'TBD'}</p>
          <p>📍 {ticket.event?.venue || 'TBD'}</p>
          <p className="font-mono mt-2 bg-gray-50 p-2 rounded text-center font-bold tracking-widest">
            {ticket.ticketCode}
          </p>
        </div>
        
        {ticket.status === 'confirmed' && onCancel && (
          <button 
            onClick={() => onCancel(ticket)} 
            className="text-red-500 text-sm font-medium hover:text-red-700"
          >
            Cancel Ticket
          </button>
        )}
      </div>
      
      {ticket.qrCode && (
        <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
          <img src={ticket.qrCode} alt="Ticket QR Code" className="w-32 h-32 object-contain" />
          <p className="text-xs text-gray-400 mt-2">Scan at venue</p>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
