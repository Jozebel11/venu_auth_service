import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
            callbackURL: '/auth/google/callback',
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails && profile.emails[0].value,
                        authProvider: 'google',
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err as Error, undefined);
            }
        }
    )
);
