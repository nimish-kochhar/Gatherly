import * as chatService from './chat.service.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const getConversations = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const conversations = await chatService.getUserConversations(userId);
  res.json({ conversations });
});

export const getMessages = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.conversationId;
  const messages = await chatService.getConversationMessages(conversationId, userId);
  res.json({ messages });
});

export const startConversation = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const targetUserId = req.body.userId;
  const conversation = await chatService.findOrCreateOneToOne(userId, targetUserId);
  res.json({ conversation });
});
