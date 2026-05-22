import Conversation from './conversation.model.js';
import Message from './message.model.js';
import ConversationParticipant from './conversationParticipant.model.js';
import User from '../user/user.model.js';
import sequelize from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';

export async function getUserConversations(userId) {
  // Find conversations the user is in
  const participants = await ConversationParticipant.findAll({
    where: { userId },
    attributes: ['conversationId']
  });
  const conversationIds = participants.map(p => p.conversationId);

  // Fetch conversations with their participants and latest message
  const conversations = await Conversation.findAll({
    where: { id: conversationIds },
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
      },
      {
        model: Message,
        limit: 1,
        order: [['createdAt', 'DESC']]
      }
    ]
  });

  // Sort them by latest message's createdAt descending
  return conversations.sort((a, b) => {
    const aDate = a.Messages?.[0]?.createdAt || a.createdAt;
    const bDate = b.Messages?.[0]?.createdAt || b.createdAt;
    return new Date(bDate) - new Date(aDate);
  });
}

export async function getConversationMessages(conversationId, userId) {
  // Verify user is in conversation
  const isParticipant = await ConversationParticipant.findOne({
    where: { conversationId, userId }
  });

  if (!isParticipant) {
    throw new AppError('Not authorized to view this conversation', 403);
  }

  const messages = await Message.findAll({
    where: { conversationId },
    order: [['createdAt', 'ASC']],
    include: [{ model: User, as: 'sender', attributes: ['id', 'username'] }]
  });

  return messages;
}

export async function findOrCreateOneToOne(userId1, userId2) {
  if (userId1 === userId2) {
    throw new AppError('Cannot start a conversation with yourself', 400);
  }

  // Find all conversations userId1 is in
  const user1Convos = await ConversationParticipant.findAll({
    where: { userId: userId1 },
    attributes: ['conversationId']
  });
  const user1ConvoIds = user1Convos.map(cp => cp.conversationId);

  let existingId = null;

  if (user1ConvoIds.length > 0) {
    // Find those that userId2 is also in
    const sharedConvos = await ConversationParticipant.findAll({
      where: {
        conversationId: user1ConvoIds,
        userId: userId2
      },
      attributes: ['conversationId']
    });
    const sharedConvoIds = sharedConvos.map(cp => cp.conversationId);

    // Ensure it has exactly 2 participants
    for (const cid of sharedConvoIds) {
      const count = await ConversationParticipant.count({ where: { conversationId: cid } });
      if (count === 2) {
        existingId = cid;
        break;
      }
    }
  }

  if (existingId) {
    return await Conversation.findByPk(existingId, {
      include: [{ model: User, attributes: ['id', 'username'] }]
    });
  }

  // Create new conversation
  const transaction = await sequelize.transaction();
  try {
    const convo = await Conversation.create({}, { transaction });
    await ConversationParticipant.bulkCreate([
      { conversationId: convo.id, userId: userId1 },
      { conversationId: convo.id, userId: userId2 }
    ], { transaction });

    await transaction.commit();

    return await Conversation.findByPk(convo.id, {
      include: [{ model: User, attributes: ['id', 'username'] }]
    });
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

export async function saveMessage(conversationId, senderId, body) {
  const message = await Message.create({
    conversationId,
    senderId,
    body
  });

  return await Message.findByPk(message.id, {
    include: [{ model: User, as: 'sender', attributes: ['id', 'username'] }]
  });
}
