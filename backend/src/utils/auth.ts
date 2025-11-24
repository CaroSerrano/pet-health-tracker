import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secret } from '../middlewares/auth.js';
import type { TokenPayload } from '../types/auth-types.js';

export async function hash(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function compare(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function createToken(data: TokenPayload) {
  return jwt.sign(data, secret);
}

export function verifyToken (token: string) {
  return jwt.verify(token, secret)
}
