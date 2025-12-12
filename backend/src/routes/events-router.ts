import { eventService } from '../services/index.js';  
import { eventController } from '../controllers/event-controller.js';  
import express from 'express';  
import { authMiddleware } from '../middlewares/auth.js';  
// import { progressiveRateLimiter } from '../middlewares/progressiveRateLimiter.js';  
import { upload, uploadDoc } from '../middlewares/upload.js';  
  
const controller = eventController({ eventService });  
const router = express.Router({ mergeParams: true });  
  
router.use(authMiddleware);  
// router.use(progressiveRateLimiter); 
  
router.post(  
  '/',  
  upload.single('attachmentUrl'),  
  uploadDoc,  
  controller.createEvent  
);  
router.get('/', controller.getPetsEvent);  
  
export default router;