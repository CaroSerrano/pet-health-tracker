/*import type { Request, Response, NextFunction } from 'express';  
  
const attempts = new Map<string, {   
  count: number;   
  resetTime: number;   
  blockUntil?: number;  
}>();  
  
export const progressiveRateLimiter = (req: Request, res: Response, next: NextFunction) => {  
  const ip = req.ip || 'unknown';  
  const now = Date.now();  
  const record = attempts.get(ip);  
  
  if (!record || now > record.resetTime) {  
    attempts.set(ip, { count: 0, resetTime: now + 15 * 60 * 1000 }); // 15 min window  
    return next();  
  }  
  
  if (record.blockUntil && now < record.blockUntil) {  
    const remainingMinutes = Math.ceil((record.blockUntil - now) / 60000);  
    return res.status(429).json({   
      error: `Account temporarily locked. Try again in ${remainingMinutes} minutes.`   
    });  
  }  
  
  record.count++;  
  
  // Bloqueo progresivo: 5 intentos = 5 min, 10 intentos = 30 min, 15+ = 2 horas  
  if (record.count >= 15) {  
    record.blockUntil = now + 2 * 60 * 60 * 1000; // 2 horas  
  } else if (record.count >= 10) {  
    record.blockUntil = now + 30 * 60 * 1000; // 30 min  
  } else if (record.count >= 5) {  
    record.blockUntil = now + 5 * 60 * 1000; // 5 min  
  }  
  
  next();  
};*/