import passport from 'passport';
import User from '../models/User';
import { IUser } from '../models/User';

passport.serializeUser((user, done) => {
    done(null, (user as IUser).id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user || null);
    } catch (err) {
        done(err as Error, null);
    }
});

