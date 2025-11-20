class PatchPushNotificationUseCase {
    constructor({ push_notificationRepo,  notificationTypeRepo }) {
        this.push_notificationRepo = push_notificationRepo;
        this.notificationTypeRepo = notificationTypeRepo;
    }

    async execute(id, patchData) {
        const existing = await this.push_notificationRepo.findById(id);
        if (!existing) {
            throw new Error('Notificación no encontrada');
        }

        const updates = {};

        // ✅ Simple fields
        if (patchData.title) updates.title = patchData.title;
        if (patchData.code) updates.code = patchData.code;
        if (patchData.body) updates.body = patchData.body;
        if (patchData.status) updates.status = patchData.status; 
        if (patchData.data) updates.data = patchData.data;
        if (patchData.destinatary) updates.destinatary = patchData.destinatary; 
 

        
        if (patchData.notificationType) {
            const type = await this.notificationTypeRepo.findById({ code: patchData.data.notificationType });
            if (!type) throw new Error('Tipo de notificación no válido');           
        }

        return updates;
    }
}

module.exports = PatchPushNotificationUseCase;
