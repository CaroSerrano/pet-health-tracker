import type { PrismaClient } from '../generated/prisma/client.js'
import type {
  FindUserPayload,
  RegisterPayload,
  SafeUser
} from '../types/auth-types.js'
import { NotFoundError, ValidationError } from '../types/errors.js'
import { hash, compare } from '../utils/auth.js'

export class AuthService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async register(data: RegisterPayload): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    })
    if (existingUser) {
      throw new ValidationError('User already exists.')
    }
    const hashedPassword = await hash(data.password)
    await this.prisma.user.create({
      data: { email: data.email, passwordHash: hashedPassword }
    })
  }

  async login(data: RegisterPayload): Promise<SafeUser> {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    })
    if (!foundUser) {
      throw new NotFoundError('User not found.')
    }
    const isValidPassword = await compare(data.password, foundUser.passwordHash)
    if (!isValidPassword) {
      throw new ValidationError('Invalid credentials')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = foundUser
    return safeUser
  }

  async findUser(data: FindUserPayload): Promise<SafeUser> {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    })
    if (!foundUser) {
      throw new NotFoundError('User not found.')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = foundUser
    return safeUser
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const hashedPassword = await hash(password)
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword }
    })
  }
}
