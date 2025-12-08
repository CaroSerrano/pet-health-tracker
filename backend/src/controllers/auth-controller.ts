import type { ControllerDeps, TokenPayload } from '../types/auth-types.js'
import type { Request, Response, NextFunction } from 'express'
import {
  recoverPasswordSchema,
  registerSchema,
  setNewPasswordSchema
} from '../types/auth-types.js'
import { createToken, verifyToken } from '../utils/auth.js'
import { sendPasswordRecoveryEmail } from '../utils/sendEmail.js'

const isProd = process.env.NODE_ENV === 'production'

export const authController = (deps: ControllerDeps) => ({
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerSchema.parse(req.body)
      await deps.authService.register(data)
      res.status(201).send('User registered.')
    } catch (error) {
      next(error)
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerSchema.parse(req.body)
      const result = await deps.authService.login(data)
      const token = createToken({ id: result.id, email: result.email })
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
      })
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  },
  logout: (_req: Request, res: Response, next: NextFunction) => {  
  try {  
    res.clearCookie('token', {  
      httpOnly: true,  
      secure: isProd,           // ← Usar isProd en lugar de process.env.NODE_ENV  
      sameSite: isProd ? 'none' : 'lax'  // ← Misma lógica que login  
    })  
    res.status(200).json({ message: 'Logged out' })  
  } catch (error) {  
    next(error)  
  }  
},
  getCurrentUser: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token
      if (!token) return res.status(401).json({ message: 'No token' })
      const decoded = verifyToken(token)
      res.json(decoded)
    } catch (error) {
      next(error)
    }
  },
  recoverPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = recoverPasswordSchema.parse(req.body)
      const user = await deps.authService.findUser({ email })
      const token = createToken({ id: user.id, expires: true })
      await sendPasswordRecoveryEmail({ email: user.email, token })
      res.json({ message: `Recovery password email sent to ${user.email}` })
    } catch (error) {
      next(error)
    }
  },

  setNewPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = setNewPasswordSchema.parse(req.body)
      const decoded = verifyToken(token) as TokenPayload
      await deps.authService.updatePassword(decoded.id, newPassword)
      res.json({ message: 'Password updated' })
    } catch (error) {
      next(error)
    }
  }
})
