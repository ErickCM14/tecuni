const redis = require('./redis');

const DEFAULT_TTL_SECONDS = parseInt(process.env.REDIS_DEFAULT_TTL || '300'); // 5 mins

async function setCache(key, value, ttl = DEFAULT_TTL_SECONDS) {
    const val = typeof value === 'string' ? value : JSON.stringify(value);
    await redis.set(key, val, 'EX', ttl);
}

async function getCache(key) {
    const val = await redis.get(key);
    try {
        return JSON.parse(val);
    } catch {
        return val;
    }
}

async function deleteCache(key) {
    await redis.del(key);
}

module.exports = {
    setCache,
    getCache,
    deleteCache,
};
