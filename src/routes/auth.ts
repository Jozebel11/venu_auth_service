import { Router } from 'express';
import passport from 'passport';
import { loginSuccess, logout } from '../controllers/authController';
import '../strategies/google';
import '../strategies/facebook';
import '../strategies/otpStrategy';
import { rateLimit } from '../utils/rateLimiter';
import { body, validationResult } from 'express-validator';
import { sendVerificationCode, checkVerificationCode } from '../utils/twilio';
import asyncHandler from 'express-async-handler';
import User from '../models/User';


const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    loginSuccess
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    loginSuccess
);

/*router.get('/apple', passport.authenticate('apple'));
router.post(
    '/apple/callback',
    passport.authenticate('apple', { failureRedirect: '/' }),
    loginSuccess
);*/

router.get('/instagram', passport.authenticate('instagram'));
router.get(
    '/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/' }),
    loginSuccess
);

router.post(
    '/register',
    [
        body('phoneNumber')
            .isString()
            .matches(/^\+\d{10,15}$/)
            .withMessage('Invalid phone number format.'),
        body('displayName')
            .isString()
            .notEmpty()
            .withMessage('Display name is required.'),
    ],
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const { phoneNumber, displayName } = req.body;

        // Rate Limiting: Allow max 5 requests per 5 minutes
        const isAllowed = await rateLimit(phoneNumber, 100, 300);
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
);

// Verification Route: Verify OTP and Register
router.post(
    '/verify-otp',
    [
        body('phoneNumber')
            .isString()
            .matches(/^\+\d{10,15}$/)
            .withMessage('Invalid phone number format.'),
        body('otp')
            .isString()
            .isLength({ min: 6, max: 6 })
            .withMessage('OTP must be exactly 6 digits.'),
        body('displayName')
            .isString()
            .notEmpty()
            .withMessage('Display name is required.'),
    ],
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const { phoneNumber, otp, displayName } = req.body;

        // Rate Limiting: Allow max 5 verification attempts per 5 minutes
        const isAllowed = await rateLimit(phoneNumber, 100, 300);
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

        // Log in the user
        req.logIn(user, (err) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Error logging in after registration.' });
                return;
            }
            res.json({ success: true, message: 'Registered and logged in successfully.', user });
        });
    })
);

// Login Route: Send OTP for Login
router.post(
    '/login',
    [
        body('phoneNumber').isMobilePhone('en-GB'),
    ],
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const { phoneNumber } = req.body;

        // Rate Limiting: Allow max 5 requests per 5 minutes
        const isAllowed = await rateLimit(phoneNumber, 100, 300);
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
);

router.post(
    '/verify-login-otp',
    [
        body('phoneNumber').isMobilePhone('en-GB'),
        body('otp').isLength({ min: 6, max: 6 }),
    ],
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }

        const { phoneNumber } = req.body;

        // Rate Limiting: Allow max 5 verification attempts per 5 minutes
        const isAllowed = await rateLimit(phoneNumber, 100, 300);
        if (!isAllowed) {
            res.status(429).json({ success: false, message: 'Too many attempts. Please try again later.' });
            return;
        }

        passport.authenticate('otp', (err: Error, user: any, info: any) => {
            if (err) return next(err);
            if (!user) {
                return res.status(400).json({ success: false, message: info.message });
            }
            req.logIn(user, (err) => {
                if (err) return next(err);
                res.json({ success: true, message: 'Logged in successfully.', user });
            });
        })(req, res, next);
    })
);


router.get('/logout', logout);


export default router;
