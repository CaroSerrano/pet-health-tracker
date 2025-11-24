import { authService } from '../services/index.js';
import { authController } from '../controllers/auth-controller.js';
import express from 'express';

const controller = authController({ authService });

const router = express.Router();
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/currentUser', controller.getCurrentUser);

export default router;
