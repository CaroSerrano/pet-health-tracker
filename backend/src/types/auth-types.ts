import { z } from 'zod';
import type { User } from '../generated/prisma/client.js';
import type { JwtPayload } from 'jsonwebtoken';

export interface IAuthService {
  register: (data: RegisterPayload) => Promise<void>;
  login: (...args: any) => Promise<SafeUser>;
}
export interface ControllerDeps {
  authService: IAuthService;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export type SafeUser = Omit<User, 'passwordHash'>;

export interface TokenPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string | undefined;
    }
  }
}

export {};
