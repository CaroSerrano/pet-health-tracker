import { authService } from '../services/index.js';  
import { authController } from '../controllers/auth-controller.js';  
import express from 'express';  
/*import { progressiveRateLimiter } from '../middlewares/progressiveRateLimiter.js';*/  
  
const controller = authController({ authService });  
const router = express.Router();  
  
router.post('/register', controller.register);  
router.post('/login', /*progressiveRateLimiter,*/ controller.login);  
router.post('/logout', controller.logout);  
router.post('/forgot-password', controller.recoverPassword);  
router.put('/reset-password',/*progressiveRateLimiter,*/ controller.setNewPassword);  
router.get('/currentUser', controller.getCurrentUser);  
  
export default router;
