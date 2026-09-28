import { useState } from 'react';
import toast from 'react-hot-toast';
import { createLostItem } from '../../api/lostDonationApi';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateLostItemForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'lost', itemName: '', description: '', location: '', contact: ''
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
      
      await createLostItem(data);
      if (onSuccess) onSuccess();
      toast.success('Item reported successfully!');
    } catch (err) {
      toast.error('Failed to report item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <label className="flex-1 flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input type="radio" name="type" value="lost" checked={formData.type === 'lost'} onChange={handleChange} />
          <span className="font-medium">I Lost Something</span>
        </label>
        <label className="flex-1 flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input type="radio" name="type" value="found" checked={formData.type === 'found'} onChange={handleChange} />
          <span className="font-medium">I Found Something</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Item Name</label>
        <input type="text" name="itemName" required className="input" onChange={handleChange} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" required className="input" rows="3" onChange={handleChange}></textarea>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input type="text" name="location" required className="input" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Info</label>
          <input type="text" name="contact" required className="input" onChange={handleChange} />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Photo (Optional)</label>
        <input type="file" accept="image/*" className="input p-1" onChange={(e) => setPhoto(e.target.files[0])} />
      </div>

      <div className="pt-4">
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <LoadingSpinner size="sm" /> : 'Submit Report'}
        </button>
      </div>
    </form>
  );
};

export default CreateLostItemForm;
