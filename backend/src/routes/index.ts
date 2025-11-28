import express from 'express';
import type { Express } from 'express';
import authRouter from './auth-router.js';

import petRouter from './pets-router.js';

const apiRouter = (app: Express) => {
  const router = express.Router();
  router.use('/api/auth', authRouter);
  
  router.use('/api/pets',petRouter);
  
  app.use(router);
};

export default apiRouter;
