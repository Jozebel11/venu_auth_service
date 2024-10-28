// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { rateLimit } from '../utils/rateLimiter';
import { validationResult } from 'express-validator';
import { sendVerificationCode, checkVerificationCode } from '../utils/twilio';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import passport from 'passport';
import '../strategies/otpStrategy';


export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout(err => {
        if (err) { return next(err); }
        req.session.destroy(err => {
            if (err) { return next(err); }
            res.clearCookie('connect.sid'); // Replace with your cookie name
            res.redirect('/');
        });
    });

};


export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        console.error(res.status(401))
    }
};

export const register = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
    }

    const { phoneNumber, displayName } = req.body;

    // Rate Limiting: Allow max 5 requests per 5 minutes
    const isAllowed = await rateLimit(phoneNumber, 5, 300);
    if (!isAllowed) {
        res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
        return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
        res.status(400).json({ success: false, message: 'Phone number already registered.' });
        return;
    }

    // Send and store OTP
    await sendVerificationCode(phoneNumber);

    res.status(200).json({ success: true, message: 'OTP sent successfully.' });
})

export const verifyOtp = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
    }

    const { phoneNumber, otp, displayName } = req.body;

    // Rate Limiting: Allow max 5 verification attempts per 5 minutes
    const isAllowed = await rateLimit(phoneNumber, 5, 300);
    if (!isAllowed) {
        res.status(429).json({ success: false, message: 'Too many attempts. Please try again later.' });
        return;
    }

    // Verify OTP
    const isValid = await checkVerificationCode(phoneNumber, otp);
    if (!isValid) {
        res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        return;
    }

    // Create new user
    const user = new User({
        phoneNumber: phoneNumber,
        name: displayName,
        authProvider: 'otp',
    });

    await user.save();

    passport.authenticate('otp', { successRedirect: '/restricted/profile', failureRedirect: '/' })
})

export const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
    }

    const { phoneNumber } = req.body;

    // Rate Limiting: Allow max 5 requests per 5 minutes
    const isAllowed = await rateLimit(phoneNumber, 5, 300);
    if (!isAllowed) {
        res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
        return;
    }

    // Check if user exists
    const user = await User.findOne({ phoneNumber, authProvider: 'otp' });
    if (!user) {
        res.status(400).json({ success: false, message: 'Phone number not registered.' });
        return;
    }

    // Send and store OTP
    await sendVerificationCode(phoneNumber);

    res.status(200).json({ success: true, message: 'OTP sent successfully.' });
})

export const verifyLoginOtp = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
    }

    const { phoneNumber } = req.body;

    // Rate Limiting: Allow max 5 verification attempts per 5 minutes
    const isAllowed = await rateLimit(phoneNumber, 5, 300);
    if (!isAllowed) {
        res.status(429).json({ success: false, message: 'Too many attempts. Please try again later.' });
        return;
    }

    passport.authenticate('otp', { successRedirect: '/profile', failureRedirect: '/' });
})


