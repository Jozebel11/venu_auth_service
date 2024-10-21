import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.NODE_ENV === 'production' ? {} : undefined, // Enable TLS in production if needed
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

export default redisClient;
