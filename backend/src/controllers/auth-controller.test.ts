import { vi, describe, it, beforeEach, expect } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { authController } from './auth-controller.js'
import {
  registerSchema,
  recoverPasswordSchema,
  setNewPasswordSchema
} from '../types/auth-types.js'
import { createToken, verifyToken } from '../utils/auth.js'
import { sendPasswordRecoveryEmail } from '../utils/sendEmail.js'

const MOCK_TOKEN = 'mocked-jwt-token-12345'

vi.mock('../types/auth-types.js', () => ({
  registerSchema: { parse: vi.fn() },
  recoverPasswordSchema: { parse: vi.fn() },
  setNewPasswordSchema: { parse: vi.fn() }
}))

vi.mock('../utils/auth.js', () => ({
  createToken: vi.fn(),
  verifyToken: vi.fn()
}))

vi.mock('../utils/sendEmail.js', () => ({
  sendPasswordRecoveryEmail: vi.fn()
}))

describe('auth-controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.resetAllMocks()
  })
  const setupMocks = (reqOverrides = {}, resOverrides = {}) => {
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      json: vi.fn(),
      cookie: vi.fn().mockReturnThis(),
      ...resOverrides
    }
    const req: Partial<Request> = {
      body: {},
      ...reqOverrides
    }
    const next: Partial<NextFunction> = vi.fn()

    const nextFn = next as NextFunction
    const resFn = res as Response
    const reqFn = req as Request

    return { reqFn, resFn, nextFn }
  }
  describe('register', () => {
    it('calls authService.register', async () => {
      const reqBody = {
        email: 'user@email.com',
        password: 'secret123'
      }
      const { reqFn, resFn, nextFn } = setupMocks({ body: reqBody })

      vi.mocked(registerSchema.parse).mockReturnValue(reqBody)
      const deps = {
        authService: {
          register: vi.fn().mockResolvedValue(undefined),
          login: vi.fn(),
          findUser: vi.fn(),
          updatePassword: vi.fn()
        }
      }

      const controller = authController(deps)
      await controller.register(reqFn, resFn, nextFn)
      expect(registerSchema.parse).toHaveBeenCalledWith(reqBody)

      expect(deps.authService.register).toHaveBeenCalledWith({
        email: 'user@email.com',
        password: 'secret123'
      })
      expect(resFn.status).toHaveBeenCalledWith(201)
      expect(resFn.send).toHaveBeenCalledWith('User registered.')
      expect(nextFn).not.toHaveBeenCalled()
    })
  })

  describe('login', () => {
    it('calls authService.login', async () => {
      const reqBody = {
        email: 'user@email.com',
        password: 'secret123'
      }
      const { reqFn, resFn, nextFn } = setupMocks({ body: reqBody })
      const safeUser = {
        id: '1',
        email: 'user@email.com',
        createdAt: '',
        updatedAt: ''
      }
      vi.mocked(registerSchema.parse).mockReturnValue(reqBody)
      vi.mocked(createToken).mockReturnValue(MOCK_TOKEN)
      const deps = {
        authService: {
          register: vi.fn(),
          login: vi.fn().mockResolvedValue(safeUser),
          findUser: vi.fn(),
          updatePassword: vi.fn()
        }
      }

      const controller = authController(deps)
      await controller.login(reqFn, resFn, nextFn)
      expect(registerSchema.parse).toHaveBeenCalledWith(reqBody)

      expect(deps.authService.login).toHaveBeenCalledWith({
        email: 'user@email.com',
        password: 'secret123'
      })
      expect(createToken).toHaveBeenCalledWith({
        id: safeUser.id,
        email: safeUser.email
      })
      expect(resFn.cookie).toHaveBeenCalledWith(
        'token',
        MOCK_TOKEN,
        expect.any(Object)
      )
      expect(resFn.status).toHaveBeenCalledWith(200)
      expect(resFn.json).toHaveBeenCalledWith(safeUser)
      expect(nextFn).not.toHaveBeenCalled()
    })
  })

  describe('recoverPassword', () => {
    it('calls next function if email is not in request body', async () => {
      const { reqFn, resFn, nextFn } = setupMocks()
      const deps = {
        authService: {
          register: vi.fn(),
          login: vi.fn(),
          findUser: vi.fn(),
          updatePassword: vi.fn()
        }
      }

      const controller = authController(deps)
      await controller.recoverPassword(reqFn, resFn, nextFn)
      expect(resFn.json).not.toHaveBeenCalled()
      expect(nextFn).toHaveBeenCalled()
    })

    it('calls authService.findUser, createToken and sendPasswordRecoveryEmail', async () => {
      const email = 'test@email.com'
      const { reqFn, resFn, nextFn } = setupMocks({
        body: { email }
      })
      const deps = {
        authService: {
          register: vi.fn(),
          login: vi.fn(),
          findUser: vi.fn().mockResolvedValue({ id: '1', email }),
          updatePassword: vi.fn()
        }
      }
      vi.mocked(recoverPasswordSchema.parse).mockReturnValue({ email })
      vi.mocked(createToken).mockReturnValue(MOCK_TOKEN)
      const controller = authController(deps)
      await controller.recoverPassword(reqFn, resFn, nextFn)
      expect(deps.authService.findUser).toHaveBeenCalledWith({ email })
      expect(createToken).toHaveBeenCalledWith({ id: '1', expires: true })
      expect(sendPasswordRecoveryEmail).toHaveBeenLastCalledWith({
        email,
        token: MOCK_TOKEN
      })
      expect(resFn.json).toHaveBeenCalled()
      expect(nextFn).not.toHaveBeenCalled()
    })
  })

  describe('setNewPassword', () => {
    it('calls next function if token or newPassword are not in request body', async () => {
      const { reqFn, resFn, nextFn } = setupMocks()
      const deps = {
        authService: {
          register: vi.fn(),
          login: vi.fn(),
          findUser: vi.fn(),
          updatePassword: vi.fn()
        }
      }

      const controller = authController(deps)
      await controller.setNewPassword(reqFn, resFn, nextFn)
      expect(resFn.json).not.toHaveBeenCalled()
      expect(nextFn).toHaveBeenCalled()
    })

    it('calls verifyToken and authService.updatePassword', async () => {
      const { reqFn, resFn, nextFn } = setupMocks({
        body: { token: MOCK_TOKEN, newPassword: '123456' }
      })
      const deps = {
        authService: {
          register: vi.fn(),
          login: vi.fn(),
          findUser: vi.fn(),
          updatePassword: vi.fn()
        }
      }
      vi.mocked(setNewPasswordSchema.parse).mockReturnValue({
        token: MOCK_TOKEN,
        newPassword: '123456'
      })
      vi.mocked(verifyToken).mockReturnValue({ id: '1' })
      const controller = authController(deps)
      await controller.setNewPassword(reqFn, resFn, nextFn)
      expect(verifyToken).toHaveBeenLastCalledWith(MOCK_TOKEN)
      expect(deps.authService.updatePassword).toHaveBeenCalledWith(
        '1',
        '123456'
      )
      expect(resFn.json).toHaveBeenCalledWith({ message: 'Password updated' })
      expect(nextFn).not.toHaveBeenCalled()
    })
  })
})
