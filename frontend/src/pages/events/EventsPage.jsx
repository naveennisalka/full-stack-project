import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../../api/eventApi';
import EventCard from '../../components/cards/EventCard';
import Modal from '../../components/common/Modal';
import CreateEventForm from '../../components/forms/CreateEventForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      setEvents(res.data.events || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBook = (event) => {
    navigate(`/events/${event._id || event.id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campus Events</h1>
        {user?.role === 'organization' && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            + Create Event
          </button>
        )}
      </div>

      <div className="mb-6 flex gap-4">
        <input type="text" placeholder="Search events..." className="input max-w-md" />
        <select className="input max-w-xs">
          <option>All Categories</option>
          <option>Academic</option>
          <option>Cultural</option>
          <option>Sports</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <EmptyState icon="📅" title="No events found" description="Check back later for upcoming events." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id || event.id} event={event} onBook={handleBook} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Event">
        <CreateEventForm onSuccess={() => { setIsModalOpen(false); fetchEvents(); }} />
      </Modal>
    </div>
  );
};

export default EventsPage;
