const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const Redis = require('ioredis');
const config = require('../config/cache')

const redisClient = new Redis({
    host: config.redis.host,
    port: 6379
});

const limiterAuth = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15, // 15 attempts by ip
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        expiry: 60,
    }),
    message: {
        status: 429,
        error: 'Demasiadas solicitudes, intenta más tarde.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const limiterGeneral = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        expiry: 60,
    }),
    message: {
        status: 429,
        error: 'Demasiadas solicitudes, intenta más tarde.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    limiterAuth,
    limiterGeneral,
};
