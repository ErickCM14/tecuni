const BaseRepository = require('./BaseRepository');
const UserModel = require('../models/UserModel');

class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }
  async findByUsername(username) {
    return this.findOne({ username });
  }
}

module.exports = UserRepository;