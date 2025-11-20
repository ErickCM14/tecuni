const BaseRepository = require('./BaseRepository');
const PermissionModel = require('../models/PermissionModel');

class PermissionRepository extends BaseRepository {
  constructor() {
    super(PermissionModel);
  }
}

module.exports = PermissionRepository;