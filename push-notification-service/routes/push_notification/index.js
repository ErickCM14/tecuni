const express = require('express');
const router = express.Router();
const PushNotificationController = require('../../src/interfaces/controllers/PushNotificationController');
const Requests = require('../../src/interfaces/requests/requests');
const PushNotificationSchema = require('../../src/interfaces/schemas/PushNotification');
const authMiddleware = require('../../src/interfaces/middlewares/auth');

router.get('/', PushNotificationController.index);
router.get('/show/:id', PushNotificationController.show);
router.get('/show-code/:code', PushNotificationController.showByCode);
router.get('/show-user/:idUser/:status?', PushNotificationController.showByIdUser);
router.post('/store', Requests(PushNotificationSchema.store()), PushNotificationController.store);
router.put('/update/:id', Requests(PushNotificationSchema.update()), PushNotificationController.update);
router.patch('/update/:id', Requests(PushNotificationSchema.patch()),PushNotificationController.update);
router.delete('/delete/:id', PushNotificationController.delete);
router.post('/send-notification/:id',PushNotificationController.send);
router.put('/read/:id/:idUser',PushNotificationController.read);

module.exports = router;