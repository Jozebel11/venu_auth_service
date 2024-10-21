import passport from 'passport';
import { Strategy as InstagramStrategy, Profile } from 'passport-instagram';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

passport.use(
    new InstagramStrategy(
        {
            clientID: process.env.INSTAGRAM_CLIENT_ID || 'INSTAGRAM_CLIENT_ID',
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || 'INSTAGRAM_CLIENT_SECRET',
            callbackURL: '/auth/instagram/callback',
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done) => {
            try {
                let user = await User.findOne({ instagramId: profile.id });

                if (!user) {
                    user = new User({
                        instagramId: profile.id,
                        name: profile.displayName,
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

