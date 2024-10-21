import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import restrictedRoutes from './routes/restrictedRoutes';
import authRouter from './routes/auth';
import './config/passport';
import './strategies/otpStrategy';
import redisClient from './utils/redisClient';
import RedisStore from "connect-redis"




dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    session({
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
            sameSite: 'lax',
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

app.use('/', restrictedRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Auth Service');
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

export default app;

