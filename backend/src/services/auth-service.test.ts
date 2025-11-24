import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth-service.js';
import prismaMock from '../__mocks__/client.js';
import type { RegisterPayload } from '../types/auth-types.js';
import { compare, hash } from '../utils/auth.js';

const service = new AuthService(prismaMock);

vi.mock('/src/client');

vi.mock('../utils/auth.js', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('auth-service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  describe('register', () => {
    it('should not create a new user, if email already exists.', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'exists@email.com',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await expect(() =>
        service.register({ email: 'exists@email.com', password: '123456' })
      ).rejects.toThrow('User already exists.');
    });

    it('should hash the password and call prisma.create with payload', async () => {
      vi.mocked(hash).mockResolvedValue('hash123');
      const registerPayload: RegisterPayload = {
        email: 'valid@email.com',
        password: 'secret123',
      };
      await service.register(registerPayload);
      expect(hash).toHaveBeenCalledWith('secret123');
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: { email: 'valid@email.com', passwordHash: 'hash123' },
      });
    });
  });

  describe('login', () => {
    it('should throw an error if user is not found', async () => {
      const loginPayload = {
        email: 'user@email.com',
        password: '123456',
      };
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(() => service.login(loginPayload)).rejects.toThrow(
        'User not found'
      );
    });
    it('should throw an error if password is not valid', async () => {
      const loginPayload = {
        email: 'user@email.com',
        password: '123456',
      };
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'user@email.com',
        passwordHash: 'hash123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(compare).mockResolvedValue(false);
      await expect(() => service.login(loginPayload)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should return a SafeUser type object', async () => {
      const loginPayload = {
        email: 'user@email.com',
        password: '123456',
      };
      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'user@email.com',
        passwordHash: 'hash123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(compare).mockResolvedValue(true);
      const result = await service.login(loginPayload);
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('email')
      expect(result).not.toHaveProperty('passwordHash')
    });
  });
});
