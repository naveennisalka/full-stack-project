import { useState } from 'react';
import toast from 'react-hot-toast';
import { createEvent } from '../../api/eventApi';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateEventForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', endDate: '', venue: '', ticketPrice: 0, totalSeats: 100, category: 'Academic', tags: ''
  });
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (banner) data.append('banner', banner);
      
      await createEvent(data);
      if (onSuccess) onSuccess();
      toast.success('Event created successfully!');
    } catch (err) {
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" name="title" required className="input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="category" className="input" onChange={handleChange}>
            <option>Academic</option>
            <option>Cultural</option>
            <option>Sports</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" required className="input" rows="3" onChange={handleChange}></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="datetime-local" name="date" required className="input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="datetime-local" name="endDate" className="input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Venue</label>
          <input type="text" name="venue" required className="input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input type="text" name="tags" className="input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ticket Price ($)</label>
          <input type="number" name="ticketPrice" min="0" required className="input" onChange={handleChange} value={formData.ticketPrice} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Seats</label>
          <input type="number" name="totalSeats" min="1" required className="input" onChange={handleChange} value={formData.totalSeats} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Banner Image</label>
        <input type="file" accept="image/*" className="input p-1" onChange={(e) => setBanner(e.target.files[0])} />
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto">
          {loading ? <LoadingSpinner size="sm" /> : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
