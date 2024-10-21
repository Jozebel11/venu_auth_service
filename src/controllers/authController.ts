// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';

export const loginSuccess = (req: Request, res: Response) => {
    if (req.user) {
        res.json({
            success: true,
            message: 'User has successfully authenticated',
            user: req.user,
        });
        res.redirect('/profile')
    } else {
        res.json({ success: false, message: 'No user authenticated' });
    }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: any) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
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


