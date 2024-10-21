// src/utils/smsService.ts
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

// Initialize Twilio Verify Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_SERVICE_SID || "";

const client = twilio(accountSid, authToken);

// Send Verification Code
export const sendVerificationCode = async (phoneNumber: string): Promise<void> => {
    try {
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
    } catch (error) {
        console.error('Error sending verification code:', error);
        throw error;
    }
};

// Check Verification Code
export const checkVerificationCode = async (phoneNumber: string, code: string): Promise<boolean> => {
    try {
        const verification_check = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: phoneNumber, code });

        return verification_check.status === 'approved';
    } catch (error) {
        console.error('Error verifying code:', error);
        return false;
    }
};
