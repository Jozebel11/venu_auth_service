import passport from 'passport';
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID || 'FACEBOOK_APP_ID',
            clientSecret: process.env.FACEBOOK_APP_SECRET || 'FACEBOOK_APP_SECRET',
            callbackURL: '/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'emails'],
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done) => {
            try {
                let user = await User.findOne({ facebookId: profile.id });

                if (!user) {
                    user = new User({
                        facebookId: profile.id,
                        name: profile.displayName,
                        email: profile.emails && profile.emails[0].value,
                        authProvider: 'facebook',
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
