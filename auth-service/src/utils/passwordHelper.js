const crypto = require('crypto');
const bcrypt = require('bcrypt');

const randomPassword = (length = 16) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const comparePasswords = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

module.exports = {
    randomPassword,
    hashPassword,
    comparePasswords,
};
