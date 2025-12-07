import { z } from 'zod'
import type { User } from '../generated/prisma/client.js'
import type { JwtPayload } from 'jsonwebtoken'

export interface IAuthService {
  register: (data: RegisterPayload) => Promise<void>
  login: (data: RegisterPayload) => Promise<SafeUser>
  findUser: (data: FindUserPayload) => Promise<SafeUser>
  updatePassword: (id: string, password: string) => Promise<void>
}
export interface ControllerDeps {
  authService: IAuthService
}

export interface RegisterPayload {
  email: string
  password: string
}

export interface FindUserPayload {
  email: string
}

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export const recoverPasswordSchema = z.object({
  email: z.email()
})

export const setNewPasswordSchema = z.object({
  newPassword: z.string().min(6),
  token: z.string()
})

export type RegisterSchema = z.infer<typeof registerSchema>

export type SafeUser = Omit<User, 'passwordHash'>

export interface TokenPayload {
  id: string
  email?: string
  expires?: boolean
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload | string | undefined
    }
  }
}

export {}
