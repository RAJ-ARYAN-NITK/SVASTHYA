import express from 'express';
import { registerUser, authUser, googleLogin, syncUser } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleLogin);
router.post('/sync', syncUser);

export default router;
