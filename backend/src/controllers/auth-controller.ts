import type { ControllerDeps } from '../types/auth-types.js';
import type { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../types/auth-types.js';

export const authController = (deps: ControllerDeps) => ({
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerSchema.parse(req.body);
      await deps.authService.register(data);
      res.status(201).send('User registered.');
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {},
});
