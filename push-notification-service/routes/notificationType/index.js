const express = require('express');
const router = express.Router();
const NotificationTypeController = require('../../src/interfaces/controllers/NotificationTypeController');
const Requests = require('../../src/interfaces/requests/requests');
const NotificationTypeSchema = require('../../src/interfaces/schemas/NotificationType');
const authMiddleware = require('../../src/interfaces/middlewares/auth');

router.get('/', NotificationTypeController.index);
router.get('/show/:id', NotificationTypeController.show);
// router.get('/create', NotificationTypeController.create);

router.get('/show-code/:code', NotificationTypeController.showByCode);
router.post('/store', Requests(NotificationTypeSchema.store()), NotificationTypeController.store);
// router.get('/edit/:id', NotificationTypeController.edit);
router.patch('/update/:id', Requests(NotificationTypeSchema.update()), NotificationTypeController.update);
router.put('/update/:id', Requests(NotificationTypeSchema.update()), NotificationTypeController.update);
router.delete('/delete/:id', NotificationTypeController.delete);

module.exports = router;