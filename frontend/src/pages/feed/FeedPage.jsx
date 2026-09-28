import { useState, useEffect, useCallback } from 'react';
import { getFeed } from '../../api/postApi';
import { getEvents } from '../../api/eventApi';
import CreatePostForm from '../../components/forms/CreatePostForm';
import PostCard from '../../components/cards/PostCard';
import EventCard from '../../components/cards/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = useCallback(async (pageNum = 1) => {
    try {
      const res = await getFeed(pageNum);
      if (pageNum === 1) setPosts(res.data.posts || []);
      else setPosts(prev => [...prev, ...(res.data.posts || [])]);
      setHasMore(res.data.hasMore || false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1);
    getEvents({ limit: 3 }).then(res => setEvents(res.data.events || [])).catch(console.error);
    setLoading(false);
  }, [fetchFeed]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 max-w-3xl">
        <CreatePostForm onSuccess={() => { setPage(1); fetchFeed(1); }} />
        
        {loading && page === 1 ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <EmptyState icon="📝" title="No posts yet" description="Be the first to share something with the campus!" />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id || post.id} post={post} />
            ))}
            {hasMore && (
              <div className="text-center pt-4">
                <button onClick={handleLoadMore} className="btn-secondary">Load More</button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="hidden lg:block w-80 space-y-6">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Upcoming Events</h3>
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming events</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event._id || event.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <h4 className="font-semibold text-sm line-clamp-1">{event.title}</h4>
                  <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
