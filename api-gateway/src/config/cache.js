require('dotenv').config();

module.exports = {
    redis: {
        host: process.env.REDIS_HOST || '',
    }
}