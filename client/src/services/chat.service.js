import api from './api.js';

export const chatService = {
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data.conversations;
  },
  getMessages: async (conversationId) => {
    const response = await api.get(`/chat/${conversationId}/messages`);
    return response.data.messages;
  },
  startConversation: async (userId) => {
    const response = await api.post('/chat/start', { userId });
    return response.data.conversation;
  }
};
