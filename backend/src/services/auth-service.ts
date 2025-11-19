import type { PrismaClient } from '../generated/prisma/client.js';
import type { RegisterPayload } from '../types/auth-types.js';
import { ValidationError } from '../types/errors.js';

export class AuthService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async register(data: RegisterPayload) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ValidationError('User already exists.');
    }
    await this.prisma.user.create({ data });
  }

  async login() {}
}
