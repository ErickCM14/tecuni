const BaseRepository = require('./BaseRepository');
const notificationTypeModel = require('../../services/models/NotificationTypeModel');


class NotificationTypeRepository extends BaseRepository {
  constructor() {
    super(notificationTypeModel);
  }
}

module.exports = NotificationTypeRepository;