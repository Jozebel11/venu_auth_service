import request from 'supertest';
import mongoose from 'mongoose';
import User, { IUser } from '../../../models/User';

describe('User Model', () => {
    beforeAll(async () => {
        // Connect to in-memory MongoDB or use a test database
        await mongoose.connect('mongodb://localhost:27017/testdb');
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });


    it('should create and save a user successfully', async () => {
        const userData: Partial<IUser> = {
            googleId: 'google123',
            email: 'jjhardwicke11@gmail.com',
            name: 'Test User',
            authProvider: 'google',
            phoneNumber: '07834470301'
        };
        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.googleId).toBe(userData.googleId);
        expect(savedUser.email).toBe(userData.email)
        expect(savedUser.name).toBe(userData.name);
    });

    it('should find a specified user successfully', async () => {
        const userData: Partial<IUser> = {
            googleId: 'fb123',
            email: 'jjhardwicke@hotmail.co.uk',
            name: 'Test User',
            authProvider: 'facebook',
            phoneNumber: '07834470303'
        };
        const user = new User(userData);
        await user.save();
        const findUser = await User.findOne({
            email: userData.email
        })
        expect(findUser).not.toBeNull();
        if (findUser) {
            console.log(findUser)
            expect(findUser.name).toBe(userData.name);
            expect(findUser.googleId).toBe(userData.googleId);

        }
    })


});