import request from 'supertest';
import mongoose from 'mongoose';
import User, { IUser } from '../../models/User';

describe('User Model', () => {
    beforeAll(() => {
        // Connect to in-memory MongoDB or use a test database
        mongoose.connect('mongodb://localhost:27017/testdb');
    });

    afterAll(() => {

        mongoose.disconnect();
    });

    it('should create and save a user successfully', async () => {
        const userData: Partial<IUser> = {
            googleId: 'google123',
            email: 'jjhardwicke@hotmail.co.uk',
            name: 'Test User',
            authProvider: 'google'
        };

        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.googleId).toBe(userData.googleId);
        expect(savedUser.email).toBe(userData.email)
        expect(savedUser.name).toBe(userData.name);
    });

    // Add more tests for validations, defaults, and methods
});