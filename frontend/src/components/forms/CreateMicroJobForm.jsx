import { useState } from 'react';
import toast from 'react-hot-toast';
import { createMicroJob } from '../../api/microJobApi';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateMicroJobForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', reward: 0, rewardType: 'Money', deadline: '', deliverableType: 'Link'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMicroJob(formData);
      if (onSuccess) onSuccess();
      toast.success('Micro Job posted!');
    } catch (err) {
      toast.error('Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input type="text" name="title" required className="input" onChange={handleChange} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" required className="input" rows="3" onChange={handleChange}></textarea>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Reward</label>
          <input type="number" name="reward" min="0" required className="input" onChange={handleChange} value={formData.reward} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reward Type</label>
          <select name="rewardType" className="input" onChange={handleChange} value={formData.rewardType}>
            <option>Money</option>
            <option>Coffee/Meal</option>
            <option>Favor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <input type="date" name="deadline" required className="input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deliverable Type</label>
          <select name="deliverableType" className="input" onChange={handleChange} value={formData.deliverableType}>
            <option>Link</option>
            <option>File</option>
            <option>Text</option>
            <option>In-Person</option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <LoadingSpinner size="sm" /> : 'Post Job'}
        </button>
      </div>
    </form>
  );
};

export default CreateMicroJobForm;
