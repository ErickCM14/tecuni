const User = require('../../../domain/entities/User');

class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(data) {
    }
}

module.exports = UpdateUserUseCase;