import { Router } from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import { logout, verifyLoginOtp, verifyOtp, register, login } from '../controllers/authController';
import '../strategies/google';
import '../strategies/facebook';
import '../strategies/otpStrategy';



const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', { successRedirect: '/restricted/profile', failureRedirect: '/' }),
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/restricted/profile', failureRedirect: '/' }),
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
    passport.authenticate('instagram', { successRedirect: '/restricted/profile', failureRedirect: '/' }),
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
    register

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
    verifyOtp

);

// Login Route: Send OTP for Login
router.post(
    '/login',
    [
        body('phoneNumber').isMobilePhone('en-GB'),
    ],
    login

);

router.post(
    '/verify-login-otp',
    [
        body('phoneNumber').isMobilePhone('en-GB'),
        body('otp').isLength({ min: 6, max: 6 }),
    ],
    verifyLoginOtp

);


router.get('/logout', logout);


export default router;
