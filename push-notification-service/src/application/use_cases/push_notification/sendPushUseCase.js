const { FirebaseNotificationService } = require('../../../services/notifications/FirebaseNotificationService');
const PushNotification = require('../../../domain/entities/PushNotification'); // tu clase sin destino


// src/usecases/sendPush.js
class SendPushUseCase {

      constructor({ push_notificationRepo,  notificationTypeRepo }) {
        this.push_notificationRepo = push_notificationRepo;
        this.notificationTypeRepo = notificationTypeRepo;
    }
    /**
     * Send to a single device token
     */
    async sendToToken({ token, content }) {
      // content = { title, body, data, (android/apns/webpush overrides si quieres) }
      const entity = new PushNotification(content);
      const message = entity.toFirebaseMessage(); // { notification, data, android, apns, webpush }

      // agrega destino aquí
      const payload = { message: { token, ...message } };

      const res = await fcm.send(payload);
      return res;
    }

    /**
     * Send to topic
     */
    async sendToTopic({ topic, content }) {
      const entity = new PushNotification(content);
      const message = entity.toFirebaseMessage();
      const payload = { message: { topic, ...message } };
      return fcm.send(payload);
    }

    /**
     * Send with condition
     * Ej: "'dogs' in topics || 'cats' in topics"
     */
    async sendWithCondition({ condition, content }) {
      const entity = new PushNotification(content);
      const message = entity.toFirebaseMessage();
      const payload = { message: { condition, ...message } };
      return fcm.send(payload);
    }
}

module.exports = SendPushUseCase;
