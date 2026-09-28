import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { likePost, commentPost } from '../../api/postApi';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      await likePost(post._id || post.id);
      if (onUpdate) onUpdate();
    } catch (err) {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      await commentPost(post._id || post.id, { content: commentText });
      setCommentText('');
      if (onUpdate) onUpdate();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const isLiked = post.likes?.includes(user?.id || user?._id);

  return (
    <div className="card mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={post.author?.avatar} name={post.author?.name || 'User'} />
          <div>
            <h4 className="font-semibold text-gray-900">{post.author?.name || 'Unknown User'}</h4>
            <p className="text-xs text-gray-500">
              {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Just now'}
            </p>
          </div>
        </div>
        {user && (user.id === post.author?._id || user._id === post.author?._id) && (
          <button className="text-gray-400 hover:text-gray-600">⋮</button>
        )}
      </div>

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.images?.length > 0 && (
        <div className={`grid gap-2 mb-4 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {post.images.map((img, idx) => (
            <img key={idx} src={img} alt="Post attachment" className="rounded-lg object-cover w-full h-48" />
          ))}
        </div>
      )}

      <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
        <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-medium ${isLiked ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'}`}>
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span>{post.likes?.length || 0} Likes</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600">
          <span>💬</span>
          <span>{post.comments?.length || 0} Comments</span>
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600">
          <span>🔗</span>
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <form onSubmit={handleComment} className="flex gap-2 mb-4">
            <Avatar src={user?.avatar} name={user?.name || 'U'} size="sm" />
            <input
              type="text"
              className="input flex-1 bg-gray-50 text-sm"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={!commentText.trim() || loading} className="btn-primary text-sm px-3 py-1">
              Post
            </button>
          </form>

          <div className="space-y-3">
            {post.comments?.map((c, i) => (
              <div key={i} className="flex gap-2">
                <Avatar src={c.user?.avatar} name={c.user?.name || 'U'} size="sm" />
                <div className="bg-gray-50 rounded-lg p-2 flex-1">
                  <h5 className="font-semibold text-sm text-gray-900">{c.user?.name || 'User'}</h5>
                  <p className="text-sm text-gray-700">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
