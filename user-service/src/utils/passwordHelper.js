const crypto = require('crypto');
const bcrypt = require('bcrypt');

class PasswordHelper {
    randomPassword = (length = 16) => {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    };

    hashPassword = async (password) => {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    };

    comparePasswords = async (password, hashedPassword) => {
        return bcrypt.compare(password, hashedPassword);
    };
}

module.exports = PasswordHelper;