import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import restrictedRoutes from './routes/restrictedRoutes';
import authRouter from './routes/auth';
import './config/passport';
import './strategies/otpStrategy';
import redisClient from './utils/redisClient';
import { redisSession } from './middleware/sessionMiddleware'




dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});


const sessionMiddleware = session(redisSession);

app.use(passport.initialize());

app.use('/auth', sessionMiddleware, passport.session(), authRouter);

app.use('/restricted', sessionMiddleware, passport.session(), restrictedRoutes);

app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('Authenticated:', req.isAuthenticated());
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Auth Service');
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

export default app;

