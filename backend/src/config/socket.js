import { Server } from 'socket.io';
import config from './index.js';
import { verifyToken } from '../shared/utils/token.js';

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      // Allow guest socket connection for public search/demo
      socket.user = { id: 'guest', role: 'GUEST' };
      return next();
    }
    try {
      const decoded = verifyToken(token);
      socket.user = decoded;
      return next();
    } catch (err) {
      socket.user = { id: 'guest', role: 'GUEST' };
      return next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id} (User: ${socket.user?.id})`);

    socket.join(`user:${socket.user?.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

export default { initSocket, getIO };
