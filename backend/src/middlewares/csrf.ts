import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';  
  
export const csrfTokens = new Map();  
  
export const generateCsrfToken = () => {  
  const token = crypto.randomBytes(32).toString('hex');  
  csrfTokens.set(token, Date.now() + 3600000); // 1 hora expiración  
  return token;  
};  
  
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {  
  if (req.method === 'GET') {  
    const token = generateCsrfToken();  
    res.cookie('csrf-token', token, { httpOnly: false, secure: process.env.NODE_ENV === 'production' });  
    return next();  
  }  
    
  const headerToken = req.headers['x-csrf-token'];  
  const cookieToken = req.cookies['csrf-token'];  
    
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {  
    return res.status(403).json({ error: 'CSRF token mismatch' });  
  }  
    
  next();  
};