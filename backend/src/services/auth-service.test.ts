import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth-service.js';
import prismaMock from '../__mocks__/client.js';
import type { RegisterPayload } from '../types/auth-types.js';
import { hash } from '../utils/auth.js';

const service = new AuthService(prismaMock);

vi.mock('/src/client');

vi.mock('../utils/auth.js', () => ({
  hash: vi.fn(),
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

  });
});
