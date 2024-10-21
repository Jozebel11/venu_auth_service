/*import passport from 'passport';
import { Strategy as AppleStrategy, Profile } from 'passport-apple';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
    new AppleStrategy(
        {
            clientID: process.env.APPLE_CLIENT_ID || 'APPLE_CLIENT_ID',
            teamID: process.env.APPLE_TEAM_ID || 'APPLE_TEAM_ID',
            keyID: process.env.APPLE_KEY_ID || 'APPLE_KEY_ID',
            privateKeyString: process.env.APPLE_PRIVATE_KEY || 'APPLE_PRIVATE_KEY',
            callbackURL: '/auth/apple/callback',
            passReqToCallback: false,
        },
        async (token: string, refreshToken: string, idToken: string, profile: Profile, done) => {
            try {
                let user = await User.findOne({ appleId: profile.id });

                if (!user) {
                    user = new User({
                        appleId: profile.id,
                        name: profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : '',
                        email: profile.email || '',
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
*/