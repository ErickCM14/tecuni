import { Router } from 'express';
import conversationsController from '../../interfaces/controllers/ConversationsController.js';

const router = Router();

router.get('/', conversationsController.index);
router.get('/show/:id', conversationsController.show);
router.post('/store', conversationsController.store);
router.put('/update/:id', conversationsController.update);
router.patch('/update/:id', conversationsController.update);
router.delete('/delete/:id', conversationsController.delete);

export default router;