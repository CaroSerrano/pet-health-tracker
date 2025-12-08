/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it, expect, vi, beforeEach, expectTypeOf } from 'vitest'
import { AuthService } from './auth-service.js'
import prismaMock from '../__mocks__/client.js'
import type { RegisterPayload, SafeUser } from '../types/auth-types.js'
import { compare, hash } from '../utils/auth.js'
import type { User } from '../generated/prisma/client.js'

const service = new AuthService(prismaMock)

vi.mock('/src/client')

vi.mock('../utils/auth.js', () => ({
  hash: vi.fn(),
  compare: vi.fn()
}))

describe('auth-service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })
  describe('register', () => {
    it('should not create a new user, if email already exists.', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'exists@email.com',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      await expect(() =>
        service.register({ email: 'exists@email.com', password: '123456' })
      ).rejects.toThrow('User already exists.')
    })

    it('should hash the password and call prisma.create with payload', async () => {
      vi.mocked(hash).mockResolvedValue('hash123')
      const registerPayload: RegisterPayload = {
        email: 'valid@email.com',
        password: 'secret123'
      }
      await service.register(registerPayload)
      expect(hash).toHaveBeenCalledWith('secret123')
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: { email: 'valid@email.com', passwordHash: 'hash123' }
      })
    })
  })

  describe('login', () => {
    it('should throw an error if user is not found', async () => {
      const loginPayload = {
        email: 'user@email.com',
        password: '123456'
      }
      prismaMock.user.findUnique.mockResolvedValue(null)
      await expect(() => service.login(loginPayload)).rejects.toThrow(
        'User not found'
      )
    })
    it('should throw an error if password is not valid', async () => {
      const loginPayload = {
        email: 'user@email.com',
        password: '123456'
      }
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'user@email.com',
        passwordHash: 'hash123',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      vi.mocked(compare).mockResolvedValue(false)
      await expect(() => service.login(loginPayload)).rejects.toThrow(
        'Invalid credentials'
      )
    })

    it('should return a SafeUser type object', async () => {
      const loginPayload = {
        email: 'user@email.com',
        password: '123456'
      }
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'user@email.com',
        passwordHash: 'hash123',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      vi.mocked(compare).mockResolvedValue(true)
      const result = await service.login(loginPayload)
      expectTypeOf(result).toEqualTypeOf<SafeUser>
    })
  })

  describe('findUser', () => {
    it('should throw an error if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)
      await expect(() =>
        service.findUser({ email: 'test@email.com' })
      ).rejects.toThrow('User not found.')
    })

    it('should return a SafeUser type object', async () => {
      const foundUser: User = {
        id: '1',
        email: 'test@email.com',
        passwordHash: 'hash123456',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      prismaMock.user.findUnique.mockResolvedValue(foundUser)
      const result = await service.findUser({ email: 'test@email.com' })
      expectTypeOf(result).toEqualTypeOf<SafeUser>
    })
  })

  describe('updatePassword', () => {
    it('should call hash function with the password and prisma.update with id and hashed password', async () => {
      vi.mocked(hash).mockResolvedValue('hash123')
      await service.updatePassword('1', 'newPassword')
      expect(hash).toHaveBeenCalledWith('newPassword')
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { passwordHash: 'hash123' }
      })
    })
  })
})
