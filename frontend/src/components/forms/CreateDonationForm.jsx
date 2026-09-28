import { useState } from 'react';
import toast from 'react-hot-toast';
import { createDonation } from '../../api/lostDonationApi';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateDonationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', goalAmount: '', deadline: ''
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (photo) data.append('photo', photo);
      
      await createDonation(data);
      if (onSuccess) onSuccess();
      toast.success('Campaign created successfully!');
    } catch (err) {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Campaign Title</label>
        <input type="text" name="title" required className="input" onChange={handleChange} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" required className="input" rows="3" onChange={handleChange}></textarea>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Goal Amount ($)</label>
          <input type="number" name="goalAmount" min="1" required className="input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <input type="date" name="deadline" required className="input" onChange={handleChange} />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Cover Photo (Optional)</label>
        <input type="file" accept="image/*" className="input p-1" onChange={(e) => setPhoto(e.target.files[0])} />
      </div>

      <div className="pt-4">
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <LoadingSpinner size="sm" /> : 'Start Campaign'}
        </button>
      </div>
    </form>
  );
};

export default CreateDonationForm;
