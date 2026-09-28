import { useState, useEffect, useRef } from 'react';
import { getConversations, getMessages, sendMessage, createOrGetConversation } from '../../api/chatApi';
import { searchUsers } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import Avatar from '../../components/common/Avatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ChatPage = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getConversations().then(res => {
      setConversations(res.data.conversations || res.data || []);
      setLoading(false);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeConv) {
      getMessages(activeConv._id).then(res => setMessages(res.data.messages || res.data || [])).catch(console.error);
      if (socket) socket.emit('join:conversation', activeConv._id);
    }
  }, [activeConv, socket]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg) => {
        if (activeConv && msg.conversation === activeConv._id) {
          setMessages(prev => [...prev, msg]);
        }
        // Update conversation list preview
        setConversations(prev => prev.map(c => c._id === msg.conversation ? { ...c, lastMessage: msg } : c));
      };
      socket.on('message:new', handleNewMessage);
      return () => socket.off('message:new', handleNewMessage);
    }
  }, [socket, activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim().length > 1) {
      try {
        const res = await searchUsers(e.target.value);
        setSearchResults(res.data.users || res.data || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const startConversation = async (otherUserId) => {
    try {
      const res = await createOrGetConversation({ participantId: otherUserId });
      const conv = res.data.conversation || res.data;
      if (!conversations.find(c => c._id === conv._id)) {
        setConversations(prev => [conv, ...prev]);
      }
      setActiveConv(conv);
      setSearch('');
      setSearchResults([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    try {
      const res = await sendMessage(activeConv._id, { content: newMessage });
      const msg = res.data.message || res.data;
      if (socket) socket.emit('message:send', msg);
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const getOtherParticipant = (conv) => {
    return conv.participants?.find(p => p._id !== user?.id && p._id !== user?._id);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <input type="text" placeholder="Search users to chat..." className="input text-sm" value={search} onChange={handleSearch} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {search ? (
            <div>
              {searchResults.map(u => (
                <div key={u._id} onClick={() => startConversation(u._id)} className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
                  <Avatar src={u.avatar} name={u.name} size="sm" />
                  <span className="text-sm font-medium">{u.name}</span>
                </div>
              ))}
            </div>
          ) : loading ? (
            <LoadingSpinner />
          ) : (
            conversations.map(conv => {
              const other = getOtherParticipant(conv);
              const isOnline = onlineUsers.includes(other?._id);
              return (
                <div 
                  key={conv._id} 
                  onClick={() => setActiveConv(conv)}
                  className={`p-4 flex items-center gap-3 cursor-pointer border-b border-gray-100 transition-colors ${activeConv?._id === conv._id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="relative">
                    <Avatar src={other?.avatar} name={other?.name} />
                    {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{other?.name}</h4>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content || 'No messages yet'}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {activeConv ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
              <Avatar src={getOtherParticipant(activeConv)?.avatar} name={getOtherParticipant(activeConv)?.name} />
              <div>
                <h3 className="font-bold text-gray-900">{getOtherParticipant(activeConv)?.name}</h3>
                {onlineUsers.includes(getOtherParticipant(activeConv)?._id) && (
                  <span className="text-xs text-green-500 font-medium">Online</span>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const isOwn = msg.sender === user?.id || msg.sender === user?._id || msg.sender?._id === user?.id || msg.sender?._id === user?._id;
                return (
                  <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isOwn ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  className="input flex-1 bg-gray-50" 
                  placeholder="Type a message..." 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)} 
                />
                <button type="submit" disabled={!newMessage.trim()} className="btn-primary">Send</button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
