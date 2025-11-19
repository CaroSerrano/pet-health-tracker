import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth-service.js';
import prismaMock from '../__mocks__/client.js';
import type { RegisterPayload } from '../types/auth-types.js';

const service = new AuthService(prismaMock);

vi.mock('/src/client');

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
        service.register({ email: 'exists@email.com', passwordHash: 'hash' })
      ).rejects.toThrow('User already exists.');
    });
    
    it('should call prisma.create with payload', async () => {
      const registerPayload: RegisterPayload = {
        email: 'valid@email.com',
        passwordHash: 'hash'
      }
      await service.register(registerPayload)
      expect(prismaMock.user.create).toHaveBeenCalledWith({data: registerPayload})
    })
  });
});
