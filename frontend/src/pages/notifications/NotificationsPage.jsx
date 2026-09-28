import { useState, useEffect } from 'react';
import { getNotifications, markAllAsRead, markAsRead } from '../../api/notificationApi';
import { useSocket } from '../../hooks/useSocket';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    getNotifications().then(res => {
      setNotifications(res.data.notifications || res.data || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notif) => {
        setNotifications(prev => [notif, ...prev]);
      };
      socket.on('notification:new', handleNewNotification);
      return () => socket.off('notification:new', handleNewNotification);
    }
  }, [socket]);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id || n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button onClick={handleMarkAllRead} className="text-sm text-primary-600 font-medium hover:text-primary-700">
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {notifications.map((notif) => (
            <div 
              key={notif._id || notif.id} 
              onClick={() => handleRead(notif._id || notif.id, notif.isRead)}
              className={`p-4 border-b border-gray-100 last:border-0 cursor-pointer flex gap-4 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-primary-50/50' : ''}`}
            >
              <div className="text-2xl">
                {notif.type === 'like' ? '❤️' : notif.type === 'comment' ? '💬' : notif.type === 'event' ? '📅' : '🔔'}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!notif.isRead ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now'}
                </p>
              </div>
              {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary-600 self-center"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
