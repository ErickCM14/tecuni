const User = require('../../../domain/entities/User');
const PasswordHelper = require('../../../utils/passwordHelper');

class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.passwordHelper = new PasswordHelper();
  }

  async execute(data) {
  }
}

module.exports = CreateUserUseCase;
