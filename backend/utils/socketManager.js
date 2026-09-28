const { Server } = require('socket.io');

let io;
const onlineUsers = new Map(); // userId -> socketId

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Register user as online
    socket.on('user:online', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });

    // Join a conversation room
    socket.on('join:conversation', (conversationId) => {
      socket.join(conversationId);
    });

    // Send a chat message
    socket.on('message:send', ({ conversationId, message }) => {
      io.to(conversationId).emit('message:receive', message);
    });

    // Typing indicators
    socket.on('typing:start', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('typing:start', { userId });
    });
    socket.on('typing:stop', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('typing:stop', { userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      for (const [userId, sockId] of onlineUsers) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('users:online', Array.from(onlineUsers.keys()));
      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

const sendNotification = (userId, notification) => {
  const socketId = onlineUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit('notification:new', notification);
  }
};

module.exports = { initSocket, getIO, sendNotification };
