import { petService } from '../services/index.js';  
import { petController } from '../controllers/pets-controller.js';  
import express from 'express';  
import { authMiddleware } from '../middlewares/auth.js';  
import { progressiveRateLimiter } from '../middlewares/progressiveRateLimiter.js';  
import { upload, uploadImage } from '../middlewares/upload.js';  
  
const controller = petController({ petService });  
const router = express.Router();  
  
router.use(authMiddleware);  
router.use(progressiveRateLimiter);  
  
router.post('/', upload.single('photoUrl'), uploadImage, controller.registerPet);  
router.get('/', controller.consultPet);  
router.get('/:id', controller.consultPetId);  
router.delete('/:id', controller.eliminatePetId);  
router.put('/:id', upload.single('photoUrl'), uploadImage,controller.editPetId);   
  
export default router;
