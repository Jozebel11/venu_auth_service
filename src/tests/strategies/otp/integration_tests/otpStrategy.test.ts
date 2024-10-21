// src/tests/integration/auth.test.ts
import request from 'supertest';
import app from '../../../../app';
import mongoose from 'mongoose';
import User, { IUser } from '../../../../models/User';

describe('Auth Routes Integration Tests', () => {
    beforeEach(async () => {
        mongoose.connect('mongodb://localhost:27017/testdb');
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });


    it('should send an OTP to the new users mobile', async () => {
        const res = await request(app)
            .post('/auth/register')
            .set('Content-Type', 'application/json')
            .send({
                phoneNumber: '+447834470303',
                displayName: 'Test User',
            });
        console.log(res.body)

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('OTP sent successfully.');
    });

    it('should handle invalid OTP during verification', async () => {
        const res = await request(app)
            .post('/auth/verify-otp')
            .send({
                phoneNumber: '+447834470303', // Twilio Magic Test Number for failure
                otp: '654321', // Any OTP
                displayName: 'Test User',
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid or expired OTP.');
    });
    /*

    it('should login an existing user by sending OTP', async () => {
        const userData: Partial<IUser> = {
            phoneNumber: '+447834470303',
            name: 'Test User',
            authProvider: 'otp'
        };

        const user = new User(userData);
        await user.save();
        const res = await request(app)
            .post('/auth/login')
            .send({
                phoneNumber: '+447834470303', // Existing user
                displayName: 'Test User'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('OTP sent successfully.');
    });


    it('should handle invalid OTP during login verification', async () => {
        const res = await request(app)
            .post('/auth/verify-login-otp')
            .send({
                phoneNumber: '+447834470303', // Twilio Magic Test Number for failure
                otp: '654321', // Any OTP
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid or expired OTP.');
    });*/
});
