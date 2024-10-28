import redisClient from '../utils/redisClient';
import RedisStore from "connect-redis"

type SameSiteType = 'lax' | 'strict' | 'none' | boolean | undefined;

const sameSiteOption: SameSiteType = 'lax';

export const redisSession = {
    store: new RedisStore({
        client: redisClient,
    }),
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        httpOnly: true,
        sameSite: sameSiteOption,
    },
}