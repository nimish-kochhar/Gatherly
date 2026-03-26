/**
 * Chat socket namespace — delegates to features/chat/chat.gateway.js.
 */
export function registerChatSocket(io) {
  const chat = io.of('/chat');

  chat.on('connection', (socket) => {
    console.log('[Chat] Connected:', socket.id);

    // TODO: Delegate events to features/chat/chat.gateway.js
    // socket.on('message:send', ...)
    // socket.on('typing', ...)

    socket.on('disconnect', () => {
      console.log('[Chat] Disconnected:', socket.id);
    });
  });
}
