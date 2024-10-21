import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../controllers/authController';

const router = Router();

router.get('/profile', isAuthenticated, (req: Request, res: Response) => {
    res.json({
        success: true,
        user: req.user,
    });
})

export default router;