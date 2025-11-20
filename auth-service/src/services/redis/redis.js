// src/redis/redisClient.js
const Redis = require('ioredis');

let instance;

function createRedisClient() {
    if (!instance) {
        instance = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
        });

        instance.on('connect', () => console.log('✅ Redis connect'));
        instance.on('error', (err) => console.error('❌ Redis error:', err));
    }

    return instance;
}

module.exports = createRedisClient();
