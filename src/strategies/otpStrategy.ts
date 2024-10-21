// src/strategies/otpStrategy.ts
import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import User from '../models/User';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_SERVICE_SID || "";

const client = twilio(accountSid, authToken);

passport.use(
    'otp',
    new CustomStrategy(async (req, done) => {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return done(null, { message: 'Phone number and OTP are required.' });
        }

        try {
            const verification_check = await client.verify.v2.services(verifyServiceSid)
                .verificationChecks
                .create({ to: phoneNumber, code: otp });

            if (verification_check.status === 'approved') {
                const user = await User.findOne({ phoneNumber, authProvider: 'local' });
                if (!user) {
                    return done(null, { message: 'User not found.' });
                }
                return done(null, user);
            } else {
                return done(null, { message: 'Invalid or expired OTP.' });
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            return done(error);
        }
    })
);

