import { useState } from 'react';
import toast from 'react-hot-toast';
import { createPost } from '../../api/postApi';
import LoadingSpinner from '../common/LoadingSpinner';

const CreatePostForm = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
      
      await createPost(formData);
      setContent('');
      setImages([]);
      if (onSuccess) onSuccess();
      toast.success('Post created!');
    } catch (err) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <textarea
        className="w-full resize-none border-0 focus:ring-0 p-0 text-gray-900 bg-transparent placeholder-gray-500 mb-4"
        rows="3"
        placeholder="What's happening on campus?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex gap-2">
          <label className="cursor-pointer text-gray-500 hover:text-primary-600 flex items-center gap-1 text-sm font-medium">
            <span>📷</span> Photo
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => setImages(Array.from(e.target.files))} 
            />
          </label>
          {images.length > 0 && <span className="text-sm text-gray-500">{images.length} selected</span>}
        </div>
        <button 
          type="submit" 
          disabled={loading || (!content.trim() && images.length === 0)}
          className="btn-primary py-1.5 px-4 text-sm"
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Post'}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;
