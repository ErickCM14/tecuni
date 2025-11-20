const BaseRepository = require('./BaseRepository');
const PushNotificationModel = require('../models/PushNotificationModel');

class PushNotificationRepository extends BaseRepository {
  constructor() {
    super(PushNotificationModel);
  }

  async findAll(query = {}, options = {}) {
        // Asegurarse de que el campo de ordenamiento no sea vacío/nulo antes de pasarlo a .sort()
        const sortField = options.sort || 'createdAt'; // Default seguro

        let dbQuery = this.model.find(query);

        // SOLO aplica .sort() si hay un campo válido
        if (sortField) { 
             dbQuery = dbQuery.sort(sortField); 
        }

        if (options.limit) {
            dbQuery = dbQuery.limit(options.limit);
        }
        
        return await dbQuery.exec();
    }

}

module.exports = PushNotificationRepository;