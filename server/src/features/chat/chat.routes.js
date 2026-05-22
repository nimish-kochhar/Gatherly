import { Router } from 'express';
import * as chatController from './chat.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.get('/conversations', authenticate, chatController.getConversations);
router.get('/:conversationId/messages', authenticate, chatController.getMessages);
router.post('/start', authenticate, chatController.startConversation);

export default router;
