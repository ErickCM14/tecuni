import { Router } from 'express';
import { ChatbotController } from '../interfaces/controllers/ChatbotController.js';
import ConversationsRouter from './conversations/index.js';
const chatbotController = new ChatbotController();

const router = Router();

router.get('/', chatbotController.verify);
router.post('/', chatbotController.index);
router.get('/', chatbotController.index);
router.get('/estimations', chatbotController.estimations);
router.get('/estimation/:phone', chatbotController.estimation);
router.post('/estimation', chatbotController.saveEstimation);
router.get('/download-estimation/:phone', chatbotController.downloadEstimation);
router.get('/pending-conversations', chatbotController.pendingConversations);
router.get('/pending-processing-conversations', chatbotController.processingPendingConversations);
router.use('/conversations', ConversationsRouter);

export default router;
