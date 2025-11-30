import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { TokenPayload } from '../types/auth-types.js';

const secret = process.env.JWT_SECRET || 'test';

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
  if (data.expires) {
    return jwt.sign({ id: data.id }, secret, { expiresIn: '15m' });
  }
  return jwt.sign(data, secret);
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret);
}
