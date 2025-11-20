const BaseRepository = require('./BaseRepository');
const RolModel = require('../models/RolModel');

class RolRepository extends BaseRepository {
  constructor() {
    super(RolModel, 'permissions');
  }
}

module.exports = RolRepository;