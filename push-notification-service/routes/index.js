const express = require('express');
const router = express.Router();
const PushNotificationRouter = require('../routes/push_notification')
const NotificationTypeRouter = require('./notificationType')
const authMiddleware = require('../src/interfaces/middlewares/auth');
const { i18nMiddleware } = require('../config/i18n');
router.use(i18nMiddleware);

router.use('/push-notification', PushNotificationRouter);
router.use('/notification-type', NotificationTypeRouter);

module.exports = router;