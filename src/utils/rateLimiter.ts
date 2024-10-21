import redisClient from './redisClient';

export const rateLimit = async (phoneNumber: string, limit: number, windowSeconds: number): Promise<boolean> => {
    const key = `rate:${phoneNumber}`;
    const current = await redisClient.incr(key);

    if (current === 1) {
        await redisClient.expire(key, windowSeconds);
    }

    if (current > limit) {
        return false; // Rate limit exceeded
    }

    return true;
};
