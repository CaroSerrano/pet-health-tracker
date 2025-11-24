import type { ControllerDeps } from '../types/auth-types.js';
import type { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../types/auth-types.js';
import { createToken, verifyToken } from '../utils/auth.js';

const isProd = process.env.NODE_ENV === 'production';

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

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await deps.authService.login(data);
      const token = createToken({ id: result.id, email: result.email });
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  logout: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });
      res.status(200).json({ message: 'Logged out' });
    } catch (error) {
      next(error);
    }
  },
  getCurrentUser: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: 'No token' });
      const decoded = verifyToken(token);
      res.json(decoded);
    } catch (error) {
      next(error);
    }
  },
});
