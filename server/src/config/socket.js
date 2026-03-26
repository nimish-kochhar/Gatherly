import { Server } from 'socket.io';
import config from './index.js';

/**
 * Create and configure the Socket.IO server.
 * @param {import('http').Server} httpServer
 */
export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
    },
  });

  return io;
}
