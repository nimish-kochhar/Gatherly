import * as chatService from './chat.service.js';
import ConversationParticipant from './conversationParticipant.model.js';

/**
 * Handle incoming socket connections for the chat namespace.
 * @param {import('socket.io').Socket} socket 
 * @param {import('socket.io').Namespace} chatNamespace
 */
export function handleChatConnection(socket, chatNamespace) {
  const userId = socket.userId;

  socket.on('join_conversation', async (conversationId) => {
    try {
      // Verify participation
      const isParticipant = await ConversationParticipant.findOne({
        where: { conversationId, userId }
      });

      if (isParticipant) {
        socket.join(`conversation_${conversationId}`);
        console.log(`[Chat] User ${userId} joined room conversation_${conversationId}`);
      } else {
        socket.emit('error', { message: 'Not authorized to join this conversation' });
      }
    } catch (error) {
      console.error('[Chat] Join error:', error.message);
      socket.emit('error', { message: 'Failed to join conversation' });
    }
  });

  socket.on('send_message', async (data) => {
    const { conversationId, text } = data;
    try {
      // 1. Verify participation
      const isParticipant = await ConversationParticipant.findOne({
        where: { conversationId, userId }
      });

      if (!isParticipant) {
        return socket.emit('error', { message: 'Not authorized to send messages to this conversation' });
      }

      // 2. Save message to DB
      const message = await chatService.saveMessage(conversationId, userId, text);

      // 3. Broadcast to everyone in the room (including sender)
      chatNamespace.to(`conversation_${conversationId}`).emit('receive_message', message.toJSON());
      
    } catch (error) {
      console.error('[Chat] Error sending message:', error.message);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
}
