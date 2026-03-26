import { registerChatSocket } from './chatSocket.js';

/**
 * Register all Socket.IO namespaces and handlers.
 */
export function registerSockets(io) {
  registerChatSocket(io);
  // TODO: registerNotificationSocket(io);
}
