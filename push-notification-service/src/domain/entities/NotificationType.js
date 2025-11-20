class NotificationType {
    constructor({ _id, code, NotificationType,status,createdUser,createdAt,updatedUser,updatedAt }) {
        this.id = _id;
        this.code = code; 
        this.notificationType = NotificationType;
        this.status = status;
        this.createdUser = createdUser;
        this.createdAt = createdAt;
        this.updatedUser = updatedUser;
        this.updatedAt = updatedAt;

    }
}

module.exports = NotificationType;