const User = require('../../../domain/entities/User');

class DeleteUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(data) {
    }
}

module.exports = DeleteUserUseCase;