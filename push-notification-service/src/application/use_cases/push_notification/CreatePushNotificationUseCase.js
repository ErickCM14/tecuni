class CreatePushNotificationUseCase {
    constructor({ push_notificationRepo, notificationTypeRepo }) {
        this.push_notificationRepo = push_notificationRepo;
        this.notificationTypeRepo = notificationTypeRepo;
    }

    async execute(payload) {
        const {
            code,
            title,
            body,
            status,
            data,
            destinatary
        } = payload;

        const type = await this.notificationTypeRepo.findOne({ code: data.notificationType });
        if (!type) throw new Error(`Tipo de notificación no válido: ${data.notificationType}`);

        const returnData = {
            code: code,
            title: title,
            body: body,
            status: status,
            data: data,
            destinatary: destinatary
        };

        return returnData
    }

    async getData(payload) {
        const {
            code,
            title,
            body,
            status,
            data,
            destinatary
        } = payload;

        const type = await this.notificationTypeRepo.findOne({ code: data.notificationType });
        if (!type) throw new Error(`Tipo de notificación no válido: ${data.notificationType}`);

        const returnData = {
            message: {
                token: '',
                notification: {
                    title: title,
                    body: body
                },
                data: data,
                android: { priority: 'high', notification: { sound: 'default', color: '#2196F3', click_action: 'OPEN_ACTIVITY_NOTIFICATIONS' } },
                apns: { payload: { aps: { sound: 'default', badge: 1 } } },
                webpush: { headers: { urgency: 'high' }, notification: { title: title, body: body } }

            }
        };

        return returnData
    }
}

module.exports = CreatePushNotificationUseCase;
