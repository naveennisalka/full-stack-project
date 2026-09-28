import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser } from '../../api/userApi';
import { getUserPosts } from '../../api/postApi';
import { getMyTickets } from '../../api/ticketApi';
import { useAuth } from '../../hooks/useAuth';
import PostCard from '../../components/cards/PostCard';
import TicketCard from '../../components/cards/TicketCard';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const profileId = id || currentUser?.id || currentUser?._id;
  const isOwnProfile = !id || id === currentUser?.id || id === currentUser?._id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const profileRes = await getUserProfile(profileId);
        setProfile(profileRes.data.user || profileRes.data);
        setIsFollowing(profileRes.data.isFollowing || false);

        const postsRes = await getUserPosts(profileId);
        setPosts(postsRes.data.posts || postsRes.data || []);

        if (isOwnProfile) {
          const ticketsRes = await getMyTickets();
          setTickets(ticketsRes.data.tickets || ticketsRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (profileId) fetchProfileData();
  }, [profileId, isOwnProfile]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(profileId);
        setIsFollowing(false);
        setProfile(prev => ({ ...prev, followersCount: Math.max(0, (prev.followersCount || 1) - 1) }));
      } else {
        await followUser(profileId);
        setIsFollowing(true);
        setProfile(prev => ({ ...prev, followersCount: (prev.followersCount || 0) + 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card overflow-hidden p-0">
        <div className="h-48 w-full bg-gradient-to-r from-primary-400 to-secondary-500">
          {profile.coverImage && <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />}
        </div>
        
        <div className="px-6 md:px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="p-1 bg-white rounded-full">
              <Avatar src={profile.avatar} name={profile.name} size="xl" />
            </div>
            
            <div className="pb-2">
              {isOwnProfile ? (
                <button className="btn-secondary text-sm font-semibold">Edit Profile</button>
              ) : (
                <button 
                  onClick={handleFollowToggle} 
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${
                    isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge text={profile.role === 'organization' ? 'Organization' : 'Student'} color={profile.role === 'organization' ? 'purple' : 'blue'} />
              <span className="text-gray-500 text-sm">{profile.faculty || profile.category || 'Member'}</span>
            </div>
            {profile.bio && <p className="mt-4 text-gray-700 whitespace-pre-wrap">{profile.bio}</p>}
          </div>

          <div className="flex gap-6 border-t border-gray-100 pt-6">
            <div className="text-center">
              <span className="block font-bold text-xl text-gray-900">{posts.length}</span>
              <span className="text-sm text-gray-500">Posts</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-xl text-gray-900">{profile.followersCount || 0}</span>
              <span className="text-sm text-gray-500">Followers</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-xl text-gray-900">{profile.followingCount || 0}</span>
              <span className="text-sm text-gray-500">Following</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-lg">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md ${tab === 'posts' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          onClick={() => setTab('posts')}
        >
          Posts
        </button>
        {isOwnProfile && (
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md ${tab === 'events' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            onClick={() => setTab('events')}
          >
            My Tickets
          </button>
        )}
      </div>

      <div>
        {tab === 'posts' ? (
          posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No posts to show</div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => <PostCard key={post._id || post.id} post={post} />)}
            </div>
          )
        ) : (
          tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No tickets to show</div>
          ) : (
            <div className="space-y-4">
              {tickets.map(ticket => <TicketCard key={ticket._id || ticket.id} ticket={ticket} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
