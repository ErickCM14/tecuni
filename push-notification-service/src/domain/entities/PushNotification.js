class PushNotification {
  constructor({
    _id,
    code,
    title,
    body,
    status,
    data,
    destinatary,
    createdUser,
    createdAt,
    updatedUser,
    updatedAt
  }) {
    this.id = _id;
    this.code = code;
    this.title = title;
    this.body = body;
    this.status = status;
    this.data = data;
    this.destinatary = destinatary;
    this.createdUser = createdUser;
    this.createdAt = createdAt;
    this.updatedUser = updatedUser;
    this.updatedAt = updatedAt;
  }

}

module.exports = PushNotification;
