import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { handleChatConnection } from '../features/chat/chat.gateway.js';

/**
 * Chat socket namespace — delegates to features/chat/chat.gateway.js.
 */
export function registerChatSocket(io) {
  const chat = io.of('/chat');

  // Authentication middleware
  chat.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  chat.on('connection', (socket) => {
    console.log('[Chat] Connected:', socket.id, 'User:', socket.userId);

    // Delegate to gateway
    handleChatConnection(socket, chat);

    socket.on('disconnect', () => {
      console.log('[Chat] Disconnected:', socket.id, 'User:', socket.userId);
    });
  });
}
