import { z } from 'zod';

export interface IAuthService {
  register: (data: RegisterPayload) => Promise<void>;
  login: (...args: any) => Promise<any>;
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
